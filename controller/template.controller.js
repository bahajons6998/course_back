const { prisma } = require('../prisma/prisma');
const formatAllTemplate = require('../utils/formatalltemplate')
// 1. CREATE: Yangi shablon yaratish
const createTemplate = async (req, res) => {
	const { id } = req.user;
	try {
		const {
			title,
			description,
			isPublic,
			singleValueInputs,
			multipleValueInputs,
		} = req.body;

		const template = await prisma.template.create({
			data: {
				title,
				description,
				isPublic: isPublic ?? true,
				userId: id,
				SingleValueInput: {
					create: singleValueInputs?.map((input, index) => ({
						name: input.name,
						description: input.description,
						type: input.type,
						required: input.required ?? false,
						order: input.order ?? index + 1, // Tartibni frontenddan yoki indexdan olish
					})),
				},
				MultipleValueInput: {
					create: multipleValueInputs?.map((input, index) => ({
						name: input.name,
						description: input.description,
						type: input.type,
						required: input.required ?? false,
						up: input.up ?? null,
						down: input.down ?? null,
						order: input.order ?? index + 1, // Tartibni frontenddan yoki indexdan olish
						Option: {
							create: input.options?.map((option) => ({
								value: option.value,
							})),
						},
					})),
				}
			},
			include: {
				SingleValueInput: true,
				MultipleValueInput: { include: { Option: true } },
			},
		});

		res.status(201).json({ message: "Template created successfully", data: template });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error creating template" });
	}
};

// 2. READ: Barcha shablonlarni olish
const getTemplates = async (req, res) => {
	const { id } = req.user
	// console.log('req=', id);
	try {
		const templates = await prisma.template.findMany({
			where: {
				userId: id
			},
			include: {
				SingleValueInput: {
				},
				MultipleValueInput: {
					include: { Option: true },
				},
			},
		});
		const formattedTemplates = formatAllTemplate(templates)
		console.log('formattedTemplates=', formattedTemplates);
		if (!formattedTemplates.length) {
			return res.status(200).json({ templates: [], message: 'Hech qanday shablon topilmadi' });
		}
		res.status(200).json({ formattedTemplates });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error fetching templates" });
	}
};


// 3. READ: ID bo'yicha shablonni olish
const getTemplateById = async (req, res) => {
	const { userId } = req.user
	const { id } = req.params;
	try {

		const template = await prisma.template.findUnique({
			where: { id: parseInt(id), userId: userId },
			include: {
				SingleValueInput: {
					orderBy: { order: 'asc' }, // Har bir ro'yxatni oldindan tartiblash
				},
				MultipleValueInput: {
					include: {
						Option: {
							orderBy: { id: 'asc' }, // Optionlarni id bo'yicha tartiblash
						},
					},
					orderBy: { order: 'asc' }, // Har bir ro'yxatni oldindan tartiblash
				},
			},
		});

		if (!template) {
			return res.status(404).json({ message: 'Template topilmadi' });
		}

		// SingleValueInput va MultipleValueInputni birlashtirib tartiblash
		const allInputs = [
			...template.SingleValueInput.map((input) => ({
				id: input.id,
				name: input.name,
				description: input.description,
				type: input.type,
				required: input.required,
				order: input.order,
				template_id: input.template_id,
				group_id: input.group_id,
				kind: 'SingleValueInput', // Input turini aniqlash uchun
			})),
			...template.MultipleValueInput.map((input) => ({
				id: input.id,
				name: input.name,
				description: input.description,
				type: input.type,
				required: input.required,
				order: input.order,
				template_id: input.template_id,
				group_id: input.group_id,
				up: input.up,
				down: input.down,
				options: input.Option, // Optionlarni qo'shish
				kind: 'MultipleValueInput', // Input turini aniqlash uchun
			})),
		];

		// order maydoni bo'yicha tartiblash
		allInputs.sort((a, b) => a.order - b.order);

		// Yangi formatlangan template ob'ekti
		const formattedTemplate = {
			...template,
			inputs: allInputs,
			SingleValueInput: undefined, // Eski ro'yxatni o'chirish (ixtiyoriy)
			MultipleValueInput: undefined, // Eski ro'yxatni o'chirish (ixtiyoriy)
		};

		res.status(200).json({ formattedTemplate });
	} catch (error) {
		console.error('Error fetching template:', error);
		res.status(500).json({ message: 'Shablonni olishda xatolik yuz berdi', error: error.message });
	}
};

// 4. UPDATE: Shablonni yangilash
const updateTemplate = async (req, res) => {
	const { id } = req.params;
	const { title, description, isPublic, singleValueInputs, multipleValueInputs } = req.body;

	try {
		// Tranzaksiya ichida barcha operatsiyalarni bajarish
		const updatedTemplate = await prisma.$transaction(async (prisma) => {
			// 1. Mavjud SingleValueInput va MultipleValueInput yozuvlarini o'chirish
			await prisma.singleValueInput.deleteMany({
				where: { template_id: parseInt(id) },
			});
			await prisma.multipleValueInput.deleteMany({
				where: { template_id: parseInt(id) },
			});

			// 2. Shablonni yangilash va yangi yozuvlarni qo'shish
			const template = await prisma.template.update({
				where: { id: parseInt(id) },
				data: {
					title,
					description,
					isPublic,
					SingleValueInput: {
						create: singleValueInputs.map((svi) => ({
							name: svi.name,
							description: svi.description,
							type: svi.type,
							required: svi.required,
							order: svi.order,
						})),
					},
					MultipleValueInput: {
						create: multipleValueInputs.map((mvi) => ({
							name: mvi.name,
							description: mvi.description,
							type: mvi.type,
							required: mvi.required,
							order: mvi.order,
							up: mvi.up,
							down: mvi.down,
							Option: {
								create: mvi.options.map((opt) => ({
									value: opt.value,
								})),
							},
						})),
					},
				},
				include: {
					SingleValueInput: true,
					MultipleValueInput: { include: { Option: true } },
				},
			});

			return template;
		});

		res.status(200).json({ data: updatedTemplate });
	} catch (error) {
		console.error('Error updating template:', error);
		res.status(500).json({ message: 'Shablonni yangilashda xatolik', error: error.message });
	}
};

// 5. DELETE: Shablonni o'chirish
const deleteTemplate = async (req, res) => {
	try {
		const { id } = req.params
		console.log(id);
		// Avval bog'langan ma'lumotlarni o'chirish (agar kerak bo'lsa
		await prisma.template.delete({
			where: { id: parseInt(id) }
		})

		res.status(200).json({ message: "Template deleted successfully" })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Error deleting template" })
	}
}
module.exports = { createTemplate, getTemplates, getTemplateById, updateTemplate, deleteTemplate };
