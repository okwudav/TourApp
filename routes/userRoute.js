const express = require('express');
const userController = require('./../controllers/userController');
const authCon = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authCon.signup);
router.post('/login', authCon.login);

router.route('/')
    .get(authCon.protect, userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;