var jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
    const createdUser = await User.create(req.body);

    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return res.status(201).json({
        status: 'success',
        token,
        data: {
            user: createdUser
        }
    });
})