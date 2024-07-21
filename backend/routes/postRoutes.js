const router = require("express").Router()
const postCtrl = require("../controllers/postCtrl")
const protect = require("../middlewares/protectRoute")

router.get("/feed", protect.protectRoute, postCtrl.getFeedPosts)
router.get("/allPosts", protect.protectRoute, postCtrl.getAllPosts)
router.get("/:id", postCtrl.getPosts)
router.get("/user/:username", postCtrl.getUserPosts)
router.post("/create", protect.protectRoute, postCtrl.createPost)
router.delete("/:id", protect.protectRoute, postCtrl.deletePosts)
router.put("/like/:id", protect.protectRoute, postCtrl.likeUnlikePosts)
router.put("/reply/:id", protect.protectRoute, postCtrl.replyPosts)

module.exports = router