const express = require('express');
const reviewCon = require('./../controllers/reviewController');
const authCon = require('./../controllers/authController');

// use merge params to have access params in tour routes
const routes = express.Router({ mergeParams: true });

// routes.route('/get-reviews-by-tour/:tourId')
//     .get(reviewCon.getReviewsByTour);

routes.route('/')
    .get(reviewCon.getAllReviews)
    .post(authCon.protect, authCon.restrictTo('user'), reviewCon.createReview);

routes.route('/:id')
    .get(reviewCon.getReview)
    .patch(reviewCon.updateReview)
    .delete(reviewCon.deleteReview);

module.exports = routes;