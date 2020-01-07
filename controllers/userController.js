const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filteredObject = (object, ...allowedFields) => {
    const newObj = {};

    //get the field name of each object, and loop through them
    Object.keys(object).forEach(_data => {
        // if the allowedFields array includes any pf the element, then add to the new object
        if (allowedFields.includes(_data)) newObj[_data] = object[_data];
    });

    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    // pass the query and the queryString
    // const features = new ApiFeatures(User.find(), req.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .pagination();

    const users = await User.find();

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

exports.updateMyData = catchAsync(async (req, res, next) => {
    // return an error if user post password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError(`This route is not used in updating password. Either remove the password from the body or use '/update-my-password' `, 400));
    }

    //filter out unwanted fields that are now allowed to be updated
    const fliteredBody = filteredObject(req.body, 'name', 'email');
    //update user document
    const updateUser = await User.findByIdAndUpdate(req.user.id, fliteredBody, {
        new: true,
        runValidators: true
    });
    // user

    res.status(200).json({
        status: 'sucess',
        data: {
            user: updateUser
        }
    });
})

exports.deleteMyData = catchAsync(async (req, res, next) => {
    // withoud deleting the data completely, just update isActive field
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(204).json({
        status: 'sucess',
        data: null
    });
})

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        data: 'This route is not yet defined...'
    });
}
