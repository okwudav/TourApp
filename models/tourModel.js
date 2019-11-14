const mongoose = require('mongoose');
const slugify = require('slugify');

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
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        }
    },

    // pass shema options
    {
        // when ever it return a JSON, also pass along the virtual properties
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// VIRTUAL PROPERTY
tourSchema.virtual('durationWeeks').get(function () {
    // return the duration per week
    return this.duration / 7;
});

tourSchema.virtual('slug').get(function () {
    // return slugged name property
    return slugify(this.name, { lower: true });
});

// DOCUMENT MIDDLE WARE runs before a save or create occurs in the database
// also known as Pre Save Hooks
// tourSchema.pre('save', function (next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });

// AFTER SAVING A DOCUMENT, doc returns the current saved document
// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// });

// QUERY MIDDLEWARES
tourSchema.pre('find', function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
});


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;