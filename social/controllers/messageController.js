const catchAsync = require("../utils/catchAsync");
const Message = require("../models/messageModel");
const AppError = require("../utils/AppError");
const Conversation = require("../models/conversationModel");
const mongoose = require("mongoose");

exports.createMessage = catchAsync(async (req, res, next) => {
	if (
		!(
			req.body.text &&
			req.body.conversation &&
			(req.body.sender || req.user)
		)
	) {
		return next(new AppError(400, "Incomplete information"));
	}
	const message = await Message.create({
		text: req.body.text,
		conversation: req.body.conversation,
		sender: req.body.sender || req.user._id,
	});
	const conversation = await Conversation.findById(req.body.conversation);
	const receiver = conversation.members
		.find(
			(m) =>
				m.toString() !== req.body.sender && m.toString() != req.user._id
		)
		.toString();
	res.json({ status: "success", data: { message, receiver } });
});

exports.getAllMessages = catchAsync(async (req, res, next) => {
	const messages = await Message.find();
	res.json({ status: "success", data: { messages } });
});

exports.getMessagesInConversation = catchAsync(async (req, res, next) => {
	const conversationExists = await Conversation.findById(
		req.params.conversationId
	);
	if (!conversationExists)
		return next(new AppError(404, "No such conversation"));
	const messages = await Message.find({
		conversation: req.params.conversationId,
	});
	if (req.user.isAdmin) {
		res.json({ status: "success", data: { messages } });
	} else {
		const conversations = await Conversation.find({
			members: { $in: req.user._id },
		});
		conversationIdList = conversations.map((c) => c._id.toString());
		if (conversationIdList.includes(req.params.conversationId)) {
			res.json({ status: "success", data: { messages } });
		} else
			return next(
				new AppError(
					403,
					"You are not allowed to access this conversation"
				)
			);
	}
});
