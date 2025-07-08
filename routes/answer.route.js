const Router = require('express')
const router = new Router()
const {
    createAnswer, getAnswersByUserTemplates
} = require('../controller/answers.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');




router.post('/create', authMiddleware, createAnswer);
router.get('/', authMiddleware, getAnswersByUserTemplates);

// router.get('/getallusers', authMiddleware, roleMiddleware, getAllUsers);
// router.get('/get/:id', getUserById);
// router.put('/update/:id', updateUser);
// router.delete('/delete', deleteUser);

module.exports = router;
