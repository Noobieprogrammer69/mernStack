const router = require("express").Router()
const messageCtrl = require("../controllers/messageCtrl")
const protect = require("../middlewares/protectRoute")


router.get("/conversations", protect.protectRoute, messageCtrl.getAllMessages)
router.get("/:otherId", protect.protectRoute, messageCtrl.getMessages)
router.post("/", protect.protectRoute, messageCtrl.sendMessage)


module.exports = router