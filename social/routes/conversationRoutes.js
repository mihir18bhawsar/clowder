const express = require("express");
const authController = require("../controllers/authController");
const convController = require("../controllers/convController");
const router = express.Router();

router.get("/me", authController.protect, convController.getMyConversations);

router.get(
	"/:memberId",
	authController.protect,
	authController.adminRightsCheck,
	convController.getConversationsByMemberId
);

router
	.route("/")
	.post(authController.protect, convController.createConversation)
	.get(
		authController.protect,
		authController.adminRightsCheck,
		convController.getAllConversations
	);

module.exports = router;
