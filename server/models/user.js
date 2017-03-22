const mongoose = require('mongoose');
const validator = require('validator');

//Creating a new todo example
let UserSchema = new mongoose.Schema({
    authType: {
        type: String,
        default: 'normal'
    },
    email: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        unique: true
    },
    //password is null if OAuth
    password: {
        type: String,
        default: null
    },
    name: {
        first: {
            type: String,
            min: 1,
            max: 20,
            trim: true,
            required: true
        },
        last: {
            type: String,
            min: 1,
            max: 20,
            trim: true,
            required: true
        }
    },
    age: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        minlength: 1,
        maxlength: 100,
        default: null,
        trim: true
    },
    summary: {
        type: String,
        minlength: 1,
        maxlength: 100,
        default: null,
        trim: true
    },
    occupation: {
        type: String,
        minlength: 1,
        maxlength: 20,
        default: null,
        trim: true

    },
    skills: [{
        type: String,
        trim: true
    }],
    experiences: [{
        name: {
            type: String,
            minlength: 1,
            required: true,
            maxlength: 30,
            trim: true
        },
        start: {
            type: Date,
            default: null
        },
        end: {
            type: Date,
            default: null
        },
        description: {
            type: String,
            maxlength: 100,
            trim: true
        }
    }],
    loc: {
        type: [Number],
        index: '2dsphere'
    },
    profilePicture: {
        type: String,
        default: null
    },
    backgroundPicture: {
        type: String,
        default: null
    },
    discoverable: {
        type: Boolean,
        default: true
    }
});

//Creating a new user example
let User = mongoose.model('User', UserSchema);

module.exports = {User};
