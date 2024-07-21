const Posts = require('../models/postModel');
const Users = require('../models/userModel');
const cloudinary = require("cloudinary").v2

const postCtrl = {
    createPost: async (req, res) => {
        try {
            const {postedBy, text} = req.body
            let {img} = req.body 

            if(!postedBy || !text) return res.status(400).json({error: "Please input all the fields"})

            const user = await Users.findById(postedBy)
            if(!user) return res.status(400).json({error: "User not found"})

            if(user._id.toString() != req.user._id.toString()) return res.status(400).json({error: "unauthorized to Post"})

            const maxLength = 500
            if(text.length > maxLength) return res.status(400).json({error: `Text must be less than ${maxLength} characters`})

            const newPost = new Posts({postedBy, text, img})

            if(img) {
                const uploadRes = await cloudinary.uploader.upload(img)
                img = uploadRes.secure_url
            }

            await newPost.save()
            return res.status(201).json(newPost)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    },
    getPosts: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)

            if(!post) return res.status(400).json({error: "Post not found"})

            res.status(200).json(post)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    },
    deletePosts: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)

            if(!post) return res.status(400).json({error: "Post not found"})

            if(post.postedBy.toString() != req.user._id.toString()) return res.status(401).json({error: "Unauthorized to Delete Post"})
                
            if(post.image) {
                const imageId = post.image.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(imageId)
            }

            await Posts.findByIdAndDelete(req.params.id)

            res.status(200).json({message: "Post Deleted"})
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    },
    likeUnlikePosts: async (req, res) => {
        try {
            const { id:postId } = req.params
            const userId = req.user._id

            const post = await Posts.findById(postId)
            
            if(!post) return res.status(400).json({error: "Post not found"})

            const userLikedPosts = post.likes.includes(userId)

            if(userLikedPosts) {
                await Posts.updateOne({_id:postId}, {$pull: {likes: userId}})
                res.status(200).json({message: "Post Unliked"})
            } else {
                post.likes.push(userId)
                await post.save()
                res.status(200).json({message: "Post Liked"})
            }

        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    },
    replyPosts: async (req, res) => {
        try {
            const { text } = req.body
            const postId = req.params.id
            const userId = req.user._id
            const avatar = req.user.avatar
            const username = req.user.username

            if(!text) return res.status(400).json({error: "Text field is required"})
            
            const post = await Posts.findById(postId)

            if(!post) return res.status(400).json({error: "Post not found"})

            const reply = { userId, text, avatar, username }

            post.replies.push(reply)
            await post.save()

            res.status(200).json(reply)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    },
    getFeedPosts: async (req, res) => {
        try {
            const userId = req.user._id
            const user = await Users.findById(userId)
            if(!user) return res.status(400).json({error: "User not found"})

            const following = user.following
            const feedPosts = await Posts.find({postedBy: {$in: following}}).sort({createdAt: -1})

            res.status(200).json({ feedPosts })
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    },
    getAllPosts: async (req, res) => {
        try {
            // const userId = req.user._id
            const allPosts = await Posts.find({}).sort({createdAt: -1})

            res.status(200).json({allPosts})
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    },
    getUserPosts: async (req, res) => {
        const { username } = req.params
        try {
            const user = await Users.findOne({ username })
            if(!user) return res.status(400).json({error: "User not found"})

            const posts = await Posts.find({ postedBy: user._id }).sort({ createdAt: -1 })
            if(!posts) return res.status(400).json({error: "User not found"})

            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message) 
        }
    }
}

module.exports = postCtrl