const router = require("express").Router()
const userCtrl = require("../controllers/userCtrl")
const protect = require("../middlewares/protectRoute")

router.get("/profile/:query", userCtrl.getUserProfile)
router.post("/signup", userCtrl.singupUser)
router.post("/login", userCtrl.loginUser)
router.post("/logout", userCtrl.logoutUser)
router.post("/follow/:id", protect.protectRoute, userCtrl.followUserUnfollow)
router.put("/update/:id", protect.protectRoute, userCtrl.updateUser)
router.get("/allUser", protect.protectRoute, userCtrl.getAllUser)
router.get("/suggested", protect.protectRoute, userCtrl.getSuggestedUsers)

module.exports = router