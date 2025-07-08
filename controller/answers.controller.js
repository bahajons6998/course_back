const { prisma } = require('../prisma/prisma');

const createAnswer = async (req, res) => {
	const { id } = req.user;
	const { answers, template } = req.body;
	const { title, templateId } = template;

	try {
		if (!answers || !template) {
			return res.status(400).json({
				message: 'Barcha maydonlarni to‘ldiring',
			});
		}

		// Victorina ni yaratish
		const victorina = await prisma.victorina.create({
			data: {
				title: title,
				templateId: parseInt(templateId),
				answeredUserId: id,
			},
		});

		// Answer larni birma-bir yaratish
		const answerData = answers.map((item) => ({
			question: item.question,
			answer: item.answer, // Bu string yoki massiv bo'lishi mumkin
			victorinaId: parseInt(victorina.id),
		}));

		await prisma.answer.createMany({
			data: answerData,
		});

		res.status(200).json({
			message: 'Answer(lar) saqlandi',
			data: victorina, answerData
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Serverda xatolik yuz berdi',
			error: error.message,
		});
	}
};


const getAnswersByUserTemplates = async (req, res) => {
	const { userId } = req.params; // URL dan keladi, masalan: /answers/by-user/7

	try {
		if (!userId) {
			return res.status(400).json({ message: 'userId kerak' });
		}

		const templates = await prisma.template.findMany({
			where: {
				userId: parseInt(userId),
			},
			include: {
				victorina: {
					include: {
						answer: true, // Har bir victorina uchun answer[] larni ham qo‘shamiz
					}
				}
			}
		});

		res.status(200).json({
			message: 'Foydalanuvchining template javoblari',
			data: templates,
		});

	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Serverda xatolik',
			error: error.message,
		});
	}
};






module.exports = {
	createAnswer, getAnswersByUserTemplates
};
