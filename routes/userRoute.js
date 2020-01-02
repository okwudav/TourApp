const express = require('express');
const userCon = require('./../controllers/userController');
const authCon = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authCon.signup);
router.post('/login', authCon.login);

router.post('/forgot-password', authCon.forgotPassword);

router.patch('/reset-password/:token', authCon.resetPassword);
router.patch('/update-my-password', authCon.protect, authCon.updatePassword);
router.patch('/update-my-data', authCon.protect, userCon.updateMyData);

router.delete('/delete-my-data', authCon.protect, userCon.deleteMyData);

router.route('/')
    .get(authCon.protect, userCon.getAllUsers)
    .post(userCon.createUser);

router.route('/:id')
    .get(userCon.getUser)
    .patch(userCon.updateUser)
    .delete(userCon.deleteUser);

module.exports = router;