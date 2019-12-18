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
            minlength: 8,
            select: false
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
        },
        passwordChangedAt: Date
    }
);


//encrypt/hash the password only on save & updating, using the middle
userSchema.pre('save', async function (next) {
    //if the password has not been modified during updating, then inore
    if (!this.isModified('password')) return next();

    // hash the pasword with cost 12
    this.password = await bcryptjs.hash(this.password, 12);
    // delete the passwordConfirm feild, as we only need it once
    this.passwordConfirm = undefined;

    next();
});

// Instance method, to be available on all instance of the document
userSchema.methods.comparePassword = async function (loginPassword, dbPassword) {
    return await bcryptjs.compare(loginPassword, dbPassword);
}

userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
    // check if password has been updated before
    if (this.passwordChangedAt) {
        // convert passChangedAt to same as JWTTimestamp, also devide it by 1000 to get it in seconds and give it base number 10
        const newPasswordChangedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // means the time that the token was issued is less than the changed timeStamp
        return JWTTimestamp < newPasswordChangedAt; // 100 < 200 (means password was changed after token was issued)
    }

    // return false which means not changed
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;