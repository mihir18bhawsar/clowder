const express = require("express");
const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");
const router = express.Router();

router.get(
	"/:conversationId",
	authController.protect,
	authController.adminRightsCheck,
	messageController.getMessagesInConversation
);

router
	.route("/")
	.post(authController.protect, messageController.createMessage)
	.get(
		authController.protect,
		authController.adminRightsCheck,
		messageController.getAllMessages
	);

module.exports = router;
