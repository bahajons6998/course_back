const { prisma } = require('../prisma/prisma');
const formatAllTemplate = require('../utils/formatalltemplate')
// 1. CREATE: Yangi shablon yaratish
const createComment = async (req, res) => {
    const { id } = req.user;
    try {
        const {
            template_id,
            description,
            isPublic,
            singleValueInputs,
            multipleValueInputs,
        } = req.body;

        const comment = await prisma.comments.create({
            data: {
                template_id: id,

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

module.exports = { createComment };
