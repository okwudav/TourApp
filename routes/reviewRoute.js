const express = require('express');
const reviewCon = require('./../controllers/reviewController');
const authCon = require('./../controllers/authController');

const routes = express.Router();

routes.route('/get-reviews-by-tour/:tourId')
    .get(reviewCon.getReviewsByTour);

routes.route('/')
    .get(reviewCon.getAllReviews)
    .post(authCon.protect, authCon.restrictTo('user'), reviewCon.createReview);

routes.route('/:id')
    .get(reviewCon.getReview)
    .patch(reviewCon.updateReview)
    .delete(reviewCon.deleteReview);

module.exports = routes;