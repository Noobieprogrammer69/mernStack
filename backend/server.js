require("dotenv").config()
const express = require("express")
const cookieparser = require("cookie-parser")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const messageRoutes = require("./routes/messageRoutes")
const cloudinary = require("cloudinary").v2
const {io, server, app, getRecipientSocketId } = require("./socket/socket");
const path = require("path")

// const app = express()

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true })); 
app.use(cookieparser())

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/messages", messageRoutes)

const PORT = process.env.PORT || 5000
const URI = process.env.MONGO_URI

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(URI, {
        });
        console.log(`MongoDB is connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

connectDB()

app.get("/", (req, res) => {
    res.status(200).send("Hello World")
})

server.listen(PORT, () => {
    console.log(`App is running on port: ${PORT}`)
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Serve React App
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
    });

	// app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// // react app
	// app.get("*", (req, res) => {
	// 	res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	// });
}









































// require("dotenv").config()
// const express = require("express")
// const cookieparser = require("cookie-parser")
// const mongoose = require("mongoose")
// const userRouter = require("./routes/userRoutes")

// const app = express()

// //routes
// app.use(express.json())
// app.use(cookieparser())

// app.use('/api/users', userRouter)

// const PORT = process.env.PORT || 5000
// const URI = process.env.MONGO_URI

// app.get('/', (req, res) => {
//     res.send("Hello")
// })

// const connectDB = async () => {
//     try {
//         const connect = await mongoose.connect(URI, {

//         })

//         console.log(`MongoDB is connected: ${connect.connection.host}`)
//     } catch (error) {
//         console.log(error)
//     }
// }

// connectDB()

// app.listen(5000, () => {
//     console.log(`app is running on port: ${PORT}`)
// })
























