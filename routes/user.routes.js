const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', auth, userController.getAllUsers); // only logined user can see this
router.put('/block', auth, userController.blockSelectedUser); // only logined user can see this
router.put('/unblock', auth, userController.unblockSelectedUser); // only logined user can see this
router.delete('/delete', auth, userController.deletedSelectedUser); // only logined user can see this

module.exports = router;