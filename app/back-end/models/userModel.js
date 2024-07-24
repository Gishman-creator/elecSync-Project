const mongoose = require('../config/db'); // Import mongoose from db.js

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'A user must have a phone number'],
        unique: true,
        minlength: 10,
        maxlength: 12
    },
    meterId: {
        type: String,
        required: [true, 'A user must have an electric meter ID'],
        unique: true,
        match: [/^\d{3} \d{4} \d{4}$/, 'Electric meter ID must be in the format XXX XXXX XXXX']
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        select: false
    },
    agreeTerms: {
        type: Boolean,
        required: [true, 'You must accept the terms and conditions']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
