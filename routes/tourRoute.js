const express = require('express');
const { getAllTours, createTour, getTour, updateTour, deleteTour } = require('./../controllers/tourController');

const router = express.Router();

// confirm ID in middleware before hitting the router
// router.param('id', checkID);

router.route('/')
    .get(getAllTours)
    .post(createTour);

router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;