const Users = require('../models/userModel');
const jwt = require('jsonwebtoken')

const protect = {
    protectRoute: async (req, res, next) => {
        try {
            const tokens = req.cookies.jwt
    
            if(!tokens) return res.status(401).json({ message: "Unauthorized" })
    
            const decoded = jwt.verify(tokens, process.env.JWT_SECRET)
    
            const user = await Users.findById(decoded.userId).select("-password")

            req.user = user

            next()
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log("Error", error.message)
        }
    }
}

module.exports = protect
