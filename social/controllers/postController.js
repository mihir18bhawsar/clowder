const catchAsync = require("../utils/catchAsync");
const Post = require("../models/postModel");
const AppError = require("../utils/AppError");
exports.getPost = catchAsync(async (req, res, next) => {
	const post = await Post.findById(req.params.id);
	res.status(200).json({ status: "success", data: { post } });
	next();
});

exports.getTimeline = catchAsync(async (req, res, next) => {
	const myPosts = await Post.find({ postedBy: req.user._id });
	const rest = req.user.following.map(
		async (user) => await Post.find({ postedBy: user._id })
	);
	const followingPosts = await Promise.all(rest);
	const opened = followingPosts.flat(1);
	const timeline = [...myPosts, ...opened];
	res.status(200).json({ status: "success", data: { timeline, myPosts } });
});
// Fetch all posts by this user
// Fetch all posts of his "following" using Promise.all
// Arranging the returned data
// creating the timeline and returning the posts.

exports.getLikes = catchAsync(async (req, res, next) => {
	const post = await Post.findById(req.params.id).populate({
		path: "likes",
		select: "username email -_id",
	});
	if (!post) return next(new AppError(404, "post does not exists"));
	res.status(200).json({
		status: "success",
		data: {
			likes: post.likes,
		},
	});
});
// find post by id and populate the likes
// check if post exist, if so return the likes.

exports.getDislikes = catchAsync(async (req, res, next) => {
	const post = await Post.findById(req.params.id).populate({
		path: "dislikes",
		select: "username email -_id",
	});
	if (!post) return next(new AppError(404, "post does not exists"));
	res.status(200).json({
		status: "success",
		data: {
			dislikes: post.dislikes,
		},
	});
});
// find post by id and populate the dislikes
// check if post exist, if so return the dislikes.
