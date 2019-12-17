const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    // pass the query and the queryString
    // const features = new ApiFeatures(User.find(), req.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .pagination();

    const users = await User.find({});

    // send response
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        result: users.length,
        data: {
            users
        }
    });
})

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        data: 'This route is not yet defined...'
    });
}

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        data: 'This route is not yet defined...'
    });
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        data: 'This route is not yet defined...'
    });
}

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        data: 'This route is not yet defined...'
    });
}
