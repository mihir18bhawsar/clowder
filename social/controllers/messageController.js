const catchAsync = require("../utils/catchAsync");
const Message = require("../models/messageModel");
const AppError = require("../utils/AppError");

exports.createMessage = catchAsync(async (req, res, next) => {
	if (!(req.body.text && req.body.conversation && req.body.sender)) {
		return next(new AppError(400, "Incomplete information"));
	}
	const message = await Message.create({
		text: req.body.text,
		conversation: req.body.conversation,
		sender: req.user._id,
	});
	res.json({ status: "success", data: { message } });
});

exports.getAllMessages = catchAsync(async (req, res, next) => {
	const messages = await Message.find();
	res.json({ status: "success", data: { messages } });
});

exports.getMessagesInConversation = catchAsync(async (req, res, next) => {
	const messages = await Message.find({
		conversation: req.params.conversationId,
	});
	res.json({ status: "success", data: { messages } });
});
