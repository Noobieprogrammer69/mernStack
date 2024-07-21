const bcrypt = require('bcryptjs');
const Users = require('../models/userModel');
const Posts = require('../models/postModel')
const { generateToken } = require('../token/generateToken');
const cloudinary = require("cloudinary").v2
const mongoose = require("mongoose");

const userCtrl = {
    singupUser: async (req, res) => {
        try {
            const { name, email, username, password } = req.body
            const user = await Users.findOne({ $or: [{ email }, { username }] })
    
            if(user) return res.status(400).json({error: "This Username already Exists"})
    
            const passHash = await bcrypt.hash(password, 10)

            const newUser = new Users({
                name,
                email,
                username,
                password: passHash
            })

            await newUser.save()

            if(newUser) {
                generateToken(newUser._id, res)
                res.status(201).json({
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    username: newUser.username,
                    bio: newUser.bio,
                    avatar: newUser.avatar
                })
            } else {
                res.status(400).json({error: "Invalid user data"})
            }

        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message)
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await Users.findOne({ email })
            const isMatch = await bcrypt.compare(password, user?.password || "")

            if(!user || !isMatch) return res.status(400).json({error: "Invalid Email or Password"})
            
            generateToken(user._id, res)

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                bio: user.bio,
                avatar: user.avatar
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message)
        }
    },

    logoutUser: (req, res) => {
        try {
            res.cookie("jwt", "", {maxAge: 1})
            res.status(200).json({message: "User Logged Out Successfully"})
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message)
        }
    },

    followUserUnfollow: async (req, res) => {
        try {
            const { id } = req.params
            const userToModify = await Users.findById(id)
            const currentUser = await Users.findById(req.user._id)

            if(id === req.user._id.toString()) return res.status(400).json({error: "You cannot follow/unfollow yourself"})

            if(!userToModify || !currentUser) return res.status(400).json({error: "User not found"})

            const isFollowing = currentUser.following.includes(id)

            if(isFollowing) {
                await Users.findByIdAndUpdate(id, { $pull: {followers: req.user._id} })
                await Users.findByIdAndUpdate(req.user._id, { $pull: {following: id} })
                res.status(200).json({ message: "User Unfollowed Successfully" })
            } else {
                await Users.findByIdAndUpdate(id, { $push: {followers: req.user._id} }) 
                await Users.findByIdAndUpdate(req.user._id, { $push: {following: id} })
                res.status(200).json({ message: "User Followed Successfully" })
            }

        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message)
        }
    },
    updateUser: async (req, res) => {
        const { name, email, username, password, bio } = req.body
        let { avatar } = req.body

        const userId = req.user._id
        try {
            let user = await Users.findById(userId)
            if(!user) return res.status(400).json({error: "User not found"})

            if(req.params.id !== userId.toString()) return res.status(400).json({error: "Unauthorized update"})

            if(password) {
                const hash = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, hash)
                user.password = hashPassword
            }

            if(avatar) {
                if(user.avatar) {
                    await cloudinary.uploader.destroy(user.avatar.split("/").pop().split(".")[0])
                }
                const uploadRes = await cloudinary.uploader.upload(avatar)
                avatar = uploadRes.secure_url
            }

            user.name = name || user.name
            user.email = email || user.email
            user.username = username || user.username
            user.avatar = avatar || user.avatar
            user.bio = bio || user.bio

            await Posts.updateMany(
                {"replies.userId": userId},
                {
                    $set: {
                        "replies.$[reply].username": user.username,
                        "replies.$[reply].avatar": user.avatar
                    }
                },
                    {arrayFilters: [{"reply.userId": userId}]}
            )

            user = await user.save()
            user.password = null
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message)
        }
    },
    getUserProfile: async (req, res) => {
        const { query } = req.params

        try {
            let user;
    
            // query is userId
            if (mongoose.Types.ObjectId.isValid(query)) {
                user = await Users.findOne({ _id: query }).select("-password").select("-updatedAt");
            } else {
                // query is username
                user = await Users.findOne({ username: query }).select("-password").select("-updatedAt");
            }
    
            if (!user) return res.status(404).json({ error: "User not found" });
    
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
            console.log("Error in getUserProfile: ", err.message);
        }
    
    },
    getAllUser: async (req, res) => {
        try {
            const allUser = await Users.find({})

            res.status(200).json({ allUser })
        } catch (error) {
            res.status(500).json({ error: err.message });
            console.log("Error in getUserProfile: ", err.message);
        }
    },
    getSuggestedUsers: async (req, res) => {
        try {
            const userId = req.user._id

            const usersFollowedByYou = await Users.findById(userId).select("following")

            const users = await Users.aggregate([{
                $match: {
                    _id: { $ne: userId }
                }
            },
            {
                $sample: { size: 100 }
            }
        ])

        const filteredUsers = users.filter(user => !usersFollowedByYou.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0, 100)

        suggestedUsers.forEach(user => user.password = null)

        res.status(200).json(suggestedUsers)
        } catch (error) {
            res.status(500).json({ error: err.message });
            console.log("Error in getUserProfile: ", err.message);
        }
    }
}

module.exports = userCtrl