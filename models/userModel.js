const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A user must have a name.']
        },
        email: {
            type: String,
            required: [true, 'A user must have an email.'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Provide a valid email.']
        },
        photo: String,
        password: {
            type: String,
            required: [true, 'Password is required.'],
            minlength: 8
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm password.'],
            validate: {
                // THIS ONLY WORKDS ON CREATE & SAVE...
                validator: function (val) {
                    return val === this.password;
                },
                message: 'Password mismatch.'
            }
        }
    }
);


//encrypt/hash the password only on save, using the middle
userSchema.pre('save', async function (next) {
    //if the password has not been modified, just call the next middle ware...
    if (!this.isModified('password')) return next();

    // hash the pasword with cost 12
    this.password = await bcryptjs.hash(this.password, 12);
    // delete the passwordConfirm feild, as we only need it once
    this.passwordConfirm = undefined;

    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;