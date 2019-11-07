const fs = require('fs');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = async (req, res) => {
    try {
        // BUILDING THE QUERY (filtering)
        const queryObj = { ...req.query }; // 
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        debugger;
        // ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        //build the queryStr and replace to put the '$' before them. 
        // const tours = await Tour.find({ difficulty: 'easy', duration: { $gte: 5 } });
        // (greater than or equal => 'gte')
        // (greater than => 'gt')
        // (less than or equal => 'lte' )
        // (less than => 'lt')
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        queryStr = JSON.parse(queryStr);

        // use without calling "await, so it can return a queryable object"
        let query = Tour.find(queryStr);

        // SORTING Feature
        if (req.query.sort) {
            // .sort('price ratingsAverage')
            const sortBy = req.query.sort.split(',').join(' ');
            query.sort(sortBy);
        }
        else {
            // if a sort value wasnt passed, ll be sorted with a default
            // will start from the latest createdAt
            query.sort('-createdAt');
        }

        // FIELDS Feature
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query.select(fields);
        }
        else {
            // remove the returning '__v' property
            query.select('-__v');
        }

        // PAGINATION
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            // throw an error when the selected page isnt available
            const totalDoc = await Tour.countDocuments();
            if (skip >= totalDoc) throw new Error('This page does not exist...');
        }

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
