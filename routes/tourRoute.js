const express = require('express');
const tourController = require('./../controllers/tourController');
const authCon = require('./../controllers/authController');

const router = express.Router();

// confirm ID in middleware before hitting the router
// router.param('id', checkID);

router.route('/get-top-5-tours')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats')
    .get(tourController.getTourStats);

router.route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);

router.route('/')
    .get(authCon.protect, tourController.getAllTours)
    .post(tourController.createTour);

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;