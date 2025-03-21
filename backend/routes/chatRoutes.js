const express = require('express')
const {protect} = require('../middlewares/authMiddleware')
const {accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require('../controller/chatController')

const router = express.Router()

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChat)
router.route("/group").post(protect, createGroupChat)
router.route("/rename").put(protect, renameGroup)
router.route("/groupAdd").put(protect, addToGroup)
router.route("/groupRemove").put(protect, removeFromGroup)

module.exports = router