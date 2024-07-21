const mongoose = require("mongoose")

const postModel = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String,
        maxLength: 500
    },

    img: {
        type: String,
    },

    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },

    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },

            text: {
                type: String,
                required: true
            },

            avatar: {
                type: String
            },

            username: {
                type: String
            }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', postModel)