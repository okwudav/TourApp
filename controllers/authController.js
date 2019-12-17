var jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const createdUser = await User.create(req.body);

    const token = signToken(createdUser._id);

    return res.status(201).json({
        status: 'success',
        token,
        data: {
            user: createdUser
        }
    });
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //check if email and password was passed
    if (!email || !password) {
        return next(new AppError('Please provide email and password.', 400))
    }

    // get user data, also select the password column, use the '+' sign to reselect it, since we have select to false 
    const user = await User.findOne({ email }).select('+password');

    //check if user not exist, using the user instance for it model method
    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // genrate token
    const token = signToken(user._id);

    return res.status(201).json({
        status: 'success',
        token
    });
})