const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: [4, "Username must be atleast 4 characters long"],
			maxlength: [15, "Username must not exceed 15 characters"],
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: [validator.isEmail, "provide valid email"],
		},
		password: {
			type: String,
			required: true,
			minlength: [8, "Password must be atleast 8 characters long"],
			select: false,
		},
		profilePicture: {
			type: String,
			default: "default.jpg",
		},
		coverPicture: {
			type: String,
			default: "home-cover.png",
		},
		followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
		following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
		isAdmin: {
			type: Boolean,
			default: false,
		},
		about: {
			type: String,
			maxlength: [50, "enter only 50 characters"],
			trim: true,
		},
		country: {
			type: String,
		},
		dob: Date,
		relationship: {
			type: String,
			enum: {
				values: ["single", "married"],
				message: "choose either single or married",
			},
		},
	},
	{
		timestamps: true,

		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userSchema.virtual("age").get(function () {
	const now = new Date(Date.now()).getFullYear();
	const birth = new Date(this.dob).getFullYear();
	return now - birth;
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});
const model = mongoose.model("User", userSchema);
module.exports = model;
