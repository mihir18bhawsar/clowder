const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		conversation: { type: mongoose.Schema.ObjectId, ref: "Conversation" },
		sender: { type: mongoose.Schema.ObjectId, ref: "User" },
		text: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Message", messageSchema);
