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
        required: [true, 'Please provide an email'],
        minlength: [8, 'Please provide a valid email'],
        trim: true,
        unique: [true, 'This email already exists!'],
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    //password is null if OAuth
    password: {
        type: String,
        minlength: [8, 'Please make your password longer than 8 characters long'],
        maxlength: [20, 'Please make your password shorter than 20 characters long'],
        default: null
    },
    name: {
        first: {
            type: String,
            min: [1, 'Please provide a valid name'],
            max: [20, 'Please provide a valid name'],
            trim: true,
            required: [true, 'Please provide a name']
        },
        last: {
            type: String,
            min: [1, 'Please provide a valid name'],
            max: [20, 'Please provide a valid name'],
            trim: true,
            required: [true, 'Please provide a name']
        }
    },
    age: {
        type: Number,
        min: [12, 'You must be older than 12'],
        max: [120, 'Please provide a valid age'],
        required: [true, 'Please provide an age']
    },
    status: {
        type: String,
        minlength: [1, 'Please provide a status'],
        maxlength: [200, "Your status can't be more than 200 characters long"],
        default: null,
        trim: true
    },
    summary: {
        type: String,
        minlength: [1, 'Please provide a summary'],
        maxlength: [300, "Your summary can't be more than 300 characters long"],
        default: null,
        trim: true
    },
    profession: {
        type: String,
        minlength: [1, 'Please provide where your profession'],
        maxlength: [30, 'Please provide a valid profession'],
        default: null,
        trim: true

    },
    work: {
        type: String,
        minlength: [1, 'Please provide where you work at'],
        maxlength: [30, 'Please provide a valid workplace'],
        default: null,
        trim: true
    },
    skills: [{
        type: String,
        minlength: [1, 'Please provide a skill'],
        maxlength: [20, 'Please provide a valid skill'],
        trim: true
    }],
    experiences: [{
        name: {
            type: String,
            minlength: [1, 'Please provide an experience'],
            maxlength: [30, 'Please provide a valid experience name'],
            required: true,
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
            minlength: [1, 'Please provide the experience description'],
            maxlength: [100, 'Please keep your experience description shorter than 100 characters'],
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
