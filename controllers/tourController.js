// const fs = require('fs');
const Tour = require('./../models/tourModel');
const ApiFeatures = require('./../utils/apiFeatures');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = async (req, res) => {
    try {
        // pass the query and the queryString
        const features = new ApiFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        const tours = await features.query;

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

exports.getTourStats = async (req, res) => {
    try {

        const stats = await Tour.aggregate([
            {
                // match ratingsAverage column to value greater than or equal 4.5 
                $match: { ratingsAverage: { $gte: 4.5 } }
            }, {
                // group tour datas, _id is compulsory which determines what is been grouped with
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRating: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }, {
                // sort based on the average price grouped property by ASC (1)
                $sort: { avgPrice: 1 }
            } //  {
            //      $match: { _id: { $ne: 'EASY'} }
            //  }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });

    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        });
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {

        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                // start dates is an array, unwind would seperates the dates and create each tour for each date
                $unwind: '$startDates'
            }, {
                $match: {
                    // should be between the first day of the current year and the last day of the current year
                    startDates: {
                        $gte: new Date(`${year}/01/01`),
                        $lte: new Date(`${year}/12/31`)
                    }
                }
            }, {
                // already sorted by year, so group by month in the _id property
                $group: {
                    _id: { $month: '$startDates' },
                    numToursStarts: { $sum: 1 },
                    // since we have more than 1 tour in a month, so we have to show the names of the tours using $push
                    tours: { $push: '$name' }
                }
            }, {
                // add field of type month and make it us value of _id
                $addFields: { month: '$_id' }
            }, {
                // hide the field of type _id
                $project: { _id: 0 }
            }, {
                // sort by numToursStarts DESC
                $sort: { numToursStarts: -1 }
            }, {
                // limit the result to 6
                $limit: 6
            }
        ]);

        res.status(200).json({
            status: 'success',
            result: plan.length,
            data: {
                plan
            }
        });

    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        });
    }
}