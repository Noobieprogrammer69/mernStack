const  mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    recipients: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    lastMessage: {
        text: String,
        sender: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
        seen: {
            type: Boolean,
            default: false
        }
    },
},{
    timestamps:true,
    strictPopulate: false
})

module.exports = mongoose.model('Conversation', conversationSchema)