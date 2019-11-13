const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name.'],
            unique: true,
            trim: true
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration.']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a maxGroupSize.']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty.']
        },
        ratingsAverage: {
            type: Number,
            default: 4.5
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price.']
        },
        discount: Number,
        summary: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            required: [true, 'A tour must have a description'],
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a imageCover.']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date]
    },

    // pass shema options
    {
        // when ever it return a JSON, also pass along the virtual properties
        toJSON: { virtuals: true },
        toObject: { virtuals: true}
    }
);
 
tourSchema.virtual('durationWeeks').get(function () {
    // return the duration per week
    return this.duration / 7; 
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;