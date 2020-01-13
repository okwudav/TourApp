const Review = require('./../models/reviewModel');
const ApiFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.createReview = catchAsync(async (req, res, next) => {

    // check if tourId and user id was passed in the body for nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    // create review object from body request
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });
})

exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        // set an options, so to return the newly updated doc & validate again
        new: true,
        runValidators: true
    });

    if (!review) {
        return next(new AppError(`No review with id ${req.params.id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    });
})

exports.getAllReviews = catchAsync(async (req, res, next) => {
    // enable filter, so as to get all reviews based on a tour
    let filter = {};
    if (!req.params.tourId) filter = { tour: req.params.tourId };

    // filter review if filter was specified
    const reviews = await Review.find(filter);

    // send response
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        result: reviews.length,
        data: {
            reviews
        }
    });
})

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new AppError(`No review with id '${req.params.id}'`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    });
})

exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
        return next(new AppError(`No review with id ${req.params.id}`, 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})