const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const AppError = require("../utils/AppError");
exports.update = catchAsync(async (req, res, next) => {
	let user;
	if (req.params.user) {
		if (req.user.isAdmin) {
			user = await User.findOneAndUpdate(
				{
					$or: [
						{ _id: req.params.user },
						{ username: req.params.user },
					],
				},
				Object.assign(req.body, { isAdmin: false }),
				{
					runValidators: true,
					new: true,
				}
			);
		}
	} else {
		user = await User.findOneAndUpdate(
			{ _id: req.user._id },
			Object.assign(req.body, { isAdmin: false }),
			{
				runValidators: true,
				new: true,
			}
		);
	}
	if (!user) return next(new AppError(404, "no user found"));
	res.status(200).json({ status: "success", data: { user } });
});
/*recap
update user and ensuring that he dont get admin rights.
*/
exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find().select("-password");
	res.status(200).json({ status: "success", data: { users } });
});

exports.checkUser = catchAsync(async (req, res, next) => {
	if (req.params.user.length <= 15) req.isusername = true;
	else req.isusername = false;
	next();
});

exports.getUser = catchAsync(async (req, res, next) => {
	let user;
	if (req.isusername)
		user = await User.findOne({ username: req.params.user });
	else user = await User.findById(req.params.user);
	if (!user) return next(new AppError(404, "No such user found"));
	res.status(200).json({ status: "success", data: { user } });
});
exports.getMe = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	res.status(200).json({ status: "success", data: { user } });
});
////////////////////////////////////////////////////////////////////////
exports.followUser = catchAsync(async (req, res, next) => {
	if (req.params.id == req.user._id)
		return next(new AppError(400, "You cant follow yourself"));
	let user;
	user = await User.findOne({ _id: req.params.id });
	if (!user)
		return next(
			new AppError(404, "The user you're trying to follow doesn't exist")
		);
	let me = await User.findOne({ _id: req.user._id });
	if (me.following.includes(user._id))
		return next(new AppError(400, "You already follow this user"));
	me.following.push(user._id);
	await me.save();
	user = await User.findOne({ _id: req.params.id });
	user.followers.push(me._id);
	await user.save();
	res.status(200).json({
		status: "updated",
		message: `${me.username} followed ${user.username}`,
	});
});
/*
recap
check if user someone is trying to follow is not himself
check if user he trys to follow exists
fetch the to be followed user
fetch the user self
check if already following
update his following list
save user who is following
Fetch user to be followed
update his followers list
save him
*/
exports.unfollowUser = catchAsync(async (req, res, next) => {
	if (req.params.id == req.user._id)
		return next(new AppError(400, "You cant unfollow yourself"));
	let user;
	user = await User.findOne({ _id: req.params.id });
	if (!user)
		return next(
			new AppError(
				404,
				"The user you're trying to unfollow doesn't exist"
			)
		);
	let me = await User.findOne({ _id: req.user._id });
	if (!me.following.includes(user._id))
		return next(new AppError(400, "You don't follow this user"));
	let index = me.following.indexOf(user._id);
	me.following.splice(index, 1);
	await me.save();
	user = await User.findOne({ _id: req.params.id });
	index = user.followers.indexOf(me._id);
	user.followers.splice(index, 1);
	await user.save();
	res.status(200).json({
		status: "updated",
		message: `${me.username} unfollowed ${user.username}`,
	});
});
/*
recap
check if user someone is trying to unfollow is not himself
check if user he trys to unfollow exists
fetch the to be unfollowed user
fetch the user self
check if already not following
remove it from his following list
save user 
Fetch user to be followed
remove user from his followers list
save him
*/
exports.showFollowers = catchAsync(async (req, res, next) => {
	const user = await User.findById(
		req.params.id || req.user._id || undefined
	).populate({ path: "followers", select: "username email -_id" });
	if (!user) next(new AppError(404, "user doesn't exist"));
	res.status(200).json({
		status: "success",
		data: { followers: user.followers },
	});
});

/*recap
get user by id from url or id of current user from the request.
populate or include his followers
return followers
*/

exports.showFollowing = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user._id).populate({
		path: "following",
		select: "username email -_id",
	});
	if (!user) next(new AppError(404, "user doesn't exist"));
	res.status(200).json({
		status: "success",
		data: { following: user.following },
	});
});
/*get user by id from url or id of current user from the request.
populate or include his following
return following*/

exports.createPost = catchAsync(async (req, res, next) => {
	const post = await Post.create({
		description: req.body.description,
		image: req.body.imageName,
		likes: [],
		dislikes: [],
		postedBy: req.user._id,
	});
	res.status(200).json({ status: "created", data: { post } });
});

////////////////////////////////////////////////////////////////////////
exports.updatePost = catchAsync(async (req, res, next) => {
	const post = await Post.findById(req.params.id);

	if (!post) return next(new AppError(404, "post is not available"));
	if (
		!(
			req.user.isAdmin ||
			req.user._id.toString() == post.postedBy.toString()
		)
	)
		return next(new AppError(403, "you are not authorized to update this"));

	post.description = req.body.description || post.description;
	post.image = req.body.image || post.image;

	await post.save();

	res.status(200).json({ status: "updated", data: { post } });
});
/*fetch post by id
allow only admin and post owner to update
ensure that post has some description and image otherwise default will also be lost
save post
*/
////////////////////////////////////////////////////////////////////////
exports.deletePost = catchAsync(async (req, res, next) => {
	const post = await Post.findById(req.params.id);

	if (!post) return next(new AppError(404, "post is not available"));

	if (
		!(
			req.user.isAdmin ||
			req.user._id.toString() == post.postedBy.toString()
		)
	)
		return next(new AppError(403, "you are not authorized to delete this"));

	await Post.findByIdAndDelete(req.params.id);
	res.status(204).json({ status: "success", data: {} });
});
/*fetch post by id
allow only admin and post owner to delete
delete
*/
////////////////////////////////////////////////////////////////////////
exports.likePost = catchAsync(async (req, res, next) => {
	const post = await Post.findById(req.params.id);
	if (!post) return next(new AppError(404, "The post is not available"));
	if (post.likes.includes(req.user._id))
		return next(new AppError(400, "you already liked this post"));
	post.likes.push(req.user._id);
	if (post.dislikes.includes(req.user._id)) {
		const index = post.dislikes.indexOf(req.user._id);
		post.dislikes.splice(index, 1);
	}
	await post.save();
	res.status(200).json({
		status: "success",
		data: { likes: post.likes.length },
	});
});
// get post by id
// check if already liked
// include user in likes list of the post
// check if it was previously disliked by this user
// if so remove the dislike
// save

////////////////////////////////////////////////////////////////////////
exports.dislikePost = catchAsync(async (req, res, next) => {
	const post = await Post.findById(req.params.id);
	if (!post) return next(new AppError(404, "The post is not available"));
	if (post.dislikes.includes(req.user._id))
		return next(new AppError(400, "you already disliked this post"));
	post.dislikes.push(req.user._id);
	if (post.likes.includes(req.user._id)) {
		const index = post.likes.indexOf(req.user._id);
		post.likes.splice(index, 1);
	}
	await post.save();
	res.status(200).json({
		status: "success",
		data: { dislikes: post.dislikes.length },
	});
});
// get post by id
// check if already disliked
// include user in dislikes list of the post
// check if it was previously liked by this user
// if so remove the like
// save

exports.getUserPosts = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ username: req.params.username });
	if (!user) return next(new AppError(404, "no user found with this name"));
	const timeline = await Post.find({ postedBy: user._id });
	res.status(200).json({
		status: "success",
		data: {
			timeline,
		},
	});
});
