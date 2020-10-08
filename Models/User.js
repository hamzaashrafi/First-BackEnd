const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let user = new Schema({
    user_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone_number: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
    },
});

module.exports = mongoose.model('user', user)