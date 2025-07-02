const express = require('express');
const router = express.Router();
const {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} = require('../controller/template.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/templates', authMiddleware, createTemplate);
router.get('/usertemplates', authMiddleware, getTemplates);
router.get('/templates/:id', authMiddleware, getTemplateById);
router.put('/templates/:id', authMiddleware, updateTemplate);
router.delete('/templates/:id', authMiddleware, deleteTemplate);

// router.get('/usertemplates', authMiddleware, getTemplates);
// router.get('/templates/:id', getTemplateById);

module.exports = router;
