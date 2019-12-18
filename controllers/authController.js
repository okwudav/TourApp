const { promisify } = require('util');
const jwt = require('jsonwebtoken');
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
    //also call the comparePassword in the if statement, so it won't execute if the user is null
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

exports.protect = catchAsync(async (req, res, next) => {
    // confirm if a token was passed
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    //check if token is empty
    if (!token) {
        return next(new AppError('Please login to get access.', 401));
    }

    //verify the signToken, "buh use the build in promisify util, so we cam use await since the method only returns a calback, so we dont break out structure"
    // jwt.sign(token, process.env.JWT_SECRET);
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user still exist
    const userData = await User.findById(decodedToken.id);
    if (!userData) return next(new AppError('User belonging to this token no longer exist.', 401));

    // check if user changed the password after the token was issued
    if (await userData.changedPasswordAfter(decodedToken.iat)) {
        return next(new AppError('Please login again, password was changed.', 401));
    }

    // call the next middleware if all checks are passed
    req.user = userData;
    next();
})