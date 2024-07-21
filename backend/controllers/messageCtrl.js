const Conversation = require("../models/conversationModel")
const Message = require("../models/messageModel")
const {getRecipientSocketId, io} = require("../socket/socket")
const cloudinary = require("cloudinary").v2

const messageCtrl = {
    sendMessage: async (req, res) => {
        try {
            const { recipientId, message } = req.body
            const senderId = req.user._id
            let {image} = req.body

            let conversation = await Conversation.findOne({
                recipients: { $all: [senderId, recipientId] }
            })

        if(!conversation) {
            conversation = new Conversation({
                recipients: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })

            await conversation.save()
        }

        if(image) {
            const uploadRes = await cloudinary.uploader.upload(image)
            image = uploadRes.secure_url
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            image: image || ""
        })

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
        ])

        const recipientSocketId = getRecipientSocketId(recipientId)
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)

        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    },
    getMessages: async (req, res) => {
        const {otherId} = req.params
        const userId = req.user._id
        try {
            const conversation = await Conversation.findOne({
                recipients: { $all: [userId, otherId] }
            })

            if(!conversation) return res.status(404).json({ error: "Conversation not found" })

            const messages = await Message.find({
                conversationId: conversation._id
            }).sort({ createdAt: 1 })

            res.status(201).json(messages)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    },
    getAllMessages: async (req, res) => {
        const userId = req.user._id

        try {
            const conversations = await Conversation.find({ recipients: userId }).populate({
                path: "recipients",
                select: "username avatar"
            })  

            conversations.forEach((conversation) => {
                conversation.recipients = conversation.recipients.filter(
                    (recipient) => recipient._id.toString() !== userId.toString()
                )
            })

            res.status(200).json(conversations)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    }
}

module.exports = messageCtrl

