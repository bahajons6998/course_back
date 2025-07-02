const Router = require('express')
const router = new Router()
const {
    register,
    login,


    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controller/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');




router.post('/register', register);
router.post('/login', login);

router.get('/getallusers', authMiddleware, roleMiddleware, getAllUsers);
router.get('/get/:id', getUserById);
router.put('/update/:id', updateUser);
router.delete('/delete', deleteUser);

module.exports = router;
