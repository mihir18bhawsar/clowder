const catchAsync = require("../utils/catchAsync");
const Conversation = require("../models/conversationModel");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");

exports.createConversation = catchAsync(async (req, res, next) => {
	if (!(req.body.sender && req.body.receiver))
		return next(new AppError(400, "sender - receiver details missing"));

	const convfind = await Conversation.aggregate([
		{
			$addFields: {
				ispresent: {
					$and: [
						{
							$in: [
								mongoose.Types.ObjectId(req.body.sender),
								"$members",
							],
						},
						{
							$in: [
								mongoose.Types.ObjectId(req.body.receiver),
								"$members",
							],
						},
					],
				},
			},
		},
		{
			$match: {
				ispresent: true,
			},
		},
	]);
	if (convfind[0]) {
		return next(new AppError(400, "Conversation already exists"));
	}
	const conversation = await Conversation.create({
		members: [req.body.sender, req.body.receiver],
	});
	res.json({ status: "success", data: { conversation } });
});

exports.getAllConversations = catchAsync(async (req, res, next) => {
	const conversations = await Conversation.find();
	res.json({
		status: "success",
		data: { conversations },
	});
});

exports.getConversationsByMemberId = catchAsync(async (req, res, next) => {
	const conversations = await Conversation.find({
		members: { $in: req.params.memberId },
	}).populate({ path: "members", select: "username" });
	res.json({ status: "success", data: { conversations } });
});

exports.getMyConversations = catchAsync(async (req, res, next) => {
	const conversations = await Conversation.find({
		members: { $in: req.user._id },
	});
	res.json({ status: "success", data: { conversations } });
});
