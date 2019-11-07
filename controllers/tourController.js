const fs = require('fs');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = async (req, res) => {
    try {
        // build the query (filtering)
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        // console.log(req.query, queryObj);

        // advanced filtering
        const queryStr = JSON.stringify(queryObj);
        queryStr.replace('/\b(gte|gt|lte|lt)\b/g', match => `$${match}`);
        console.log(queryStr);

        // use without calling "await, so it can return a queryable object"
        const query = Tour.find(queryObj);

        // const query = Tour.find()
        //     .where('duration').equals(5)
        //     .where('difficulty').equals('easy');

        // { difficulty: 'easy', duration: { $gte: 5 } }
        // (greater than or equal => 'gte')
        // (greater than => 'gt')
        // (less than or equal => 'lte' )
        // (less than => 'lt')

        // execute query
        const tours = await query;

        // send response
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            result: tours.length,
            data: {
                tours
            }
        });

    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        });
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // const tour = await Tour.findOne({ _id: req.params.id });

        if (!tour) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        });

    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        });
    }
}

exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({});
        // newTour.save();
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            // set an options, so to return the newly updated doc & validate again
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        });

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });

    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        });
    }
}
