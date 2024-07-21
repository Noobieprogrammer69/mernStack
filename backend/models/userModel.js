const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        maxLength: 25,
        required: true
    },

    name: {
        type: String,
        trim: true,
        unique: true,
        maxLength: 25,
    },

    email: {
        type: String,
        trim: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        default: '',
    },

    school: {
        type: String,
        default: '',
    },

    nickName: {
        type: String,
        default: '',
    },

    phone: {
        type: String,
        default: ''
    },

    avatar: {
        type: String,
        default:''
    },

    bio: {
        type: String,
        default: '',
        maxLength: 200,
    },

    followers: {
        type: [String],
        default: []
    },

    following: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userModel)