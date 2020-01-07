const Review = require('./../models/reviewModel');
const ApiFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.createReview = catchAsync(async (req, res, next) => {
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
    const reviews = await Review.findById();

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

exports.getReviewsByTour = catchAsync(async (req, res, next) => {
    // get reviews based on a tour
    const reviews = await Review.find({ tour: req.params.tourId });

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
