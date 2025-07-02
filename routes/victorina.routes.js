const express = require('express');
const router = express.Router();
const {
    getTemplates,
    getTemplateById,
} = require('../controller/victorina.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, getTemplates);
router.get('/:id',authMiddleware, getTemplateById);

module.exports = router;
