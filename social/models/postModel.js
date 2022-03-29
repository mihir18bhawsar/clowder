const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const postSchema = new mongoose.Schema(
	{
		image: {
			type: String,
			default: "default.jpg",
		},
		description: {
			type: String,
			maxlength: 200,
		},
		postedBy: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
		dislikes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
	},
	{
		timestamps: true,
	}
);

postSchema.pre("save", function (next) {
	if (!(this.description && this.image))
		return next(new AppError(400, "post cant be empty"));
	next();
});

const model = mongoose.model("Post", postSchema);
module.exports = model;
