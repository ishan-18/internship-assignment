const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter your name'],
        minLength: [2, 'Name should be at least 2 characters'],
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, "Please Enter your email address"],
        unique: [true, "Email Already exists"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email']
    },
    contact: {
        type: String,
        required: [true, "Please Enter your contact number"],
        match: [/^\+?([0-9]{2})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{5})$/, 'Please Enter a valid phone number']
    },
    password: {
        type: String,
        required: [true, "Please Enter the password"],
        minLength: [6, "Password must be at least 6 characters"]
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }, 
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)