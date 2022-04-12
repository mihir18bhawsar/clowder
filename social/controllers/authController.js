const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { promisify } = require("util");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

//_-------------------------------------------------------------

exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	if (!token) {
		return next(new AppError(401, "You Need to Login First!"));
	}
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const currentUser = await User.findOne({ _id: decoded._id });
	if (!currentUser) {
		return next(
			new AppError(
				404,
				"user with the provided token is not with us anymore"
			)
		);
	}
	req.user = currentUser;
	next();
});
/*recap
  checks for token in authentication header as well as cookie
  verifies token and finds user with token information
  if user is in the database then put him on the request else error.
*/

//---------------------------------------------------------------

exports.isLoggedIn = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	//
	if (!token) return next();

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const currentUser = await User.findOne({ _id: decoded._id });
	if (!currentUser) {
		return next();
	}
	req.user = currentUser;
	next();
});
/*recap
checks for token in authentication header and cookies
verifies token
takes user information using token
if user exists, puts him on request
if not exists doesnot put him on the request so that conditional rendering can be done.
*/

//protect vs isloggedin: protect refuses to render anything but isloggedin allows to render non sensitive part

//=============================================================

exports.adminRightsCheck = catchAsync(async (req, res, next) => {
	if (!req.user.isAdmin) return next(new AppError(403, "Must have Rights"));
	next();
});

//////////////////////////////////////////////////////////////////////

exports.register = catchAsync(async (req, res, next) => {
	const user = await User.create(Object.assign(req.body, { isAdmin: false }));
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
	res.status(200).json({ status: "success", data: { user }, token });
});

/*recap
  creates user / set Admin to false explicitly for preventing someone from setting admin rights while registering
  sign token for him
  store token in cookie as well
*/

/////////////////////////////////////////////////////////////////////

exports.login = catchAsync(async (req, res, next) => {
	if (!(req.body.password && req.body.email))
		return next(new AppError(400, "Enter email and Password"));
	if (!validator.isEmail(req.body.email)) {
		return next(new AppError(400, "Enter valid Email Address"));
	}
	const user = await User.findOne({ email: req.body.email }).select(
		"+password"
	);
	if (!user || user.disabled)
		return next(new AppError(404, "User not found"));

	const passwordCorrect = await bcrypt.compare(
		req.body.password,
		user.password
	);
	if (!passwordCorrect)
		return next(new AppError(400, "Password is incorrect"));
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

	res.status(200).json({
		message: "logged in",
		token,
		username: user.username,
		userId: user._id,
		profilePicture: user.profilePicture,
	});
});
/*recap
    get user with provided email
    fetch original password of this user from database
    bcrypt compare provided password and original encrypted password
    if ok sign token and store in cookie as well
 */

/*
1.protect 
2.login check
3.admin check
4.register 
5.login
*/
