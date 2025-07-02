const { prisma } = require('../prisma/prisma');
const formatAllTemplate = require('../utils/formatalltemplate')
// 1. CREATE: Yangi shablon yaratish


// 2. READ: Barcha shablonlarni olish
const getTemplates = async (req, res) => {
    try {
        const templates = await prisma.template.findMany({
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
    try {
        const { id } = req.params;

        const template = await prisma.template.findUnique({
            where: { id: parseInt(id) },
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

module.exports = { getTemplates, getTemplateById };
