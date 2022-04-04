const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const multerStorage = multer.memoryStorage();

const imageConfigure = catchAsync(async (req, res, next) => {
	if (!req.files) return next();
	let coverFile, profileFile;
	if (req.files.coverPicture) coverFile = req.files.coverPicture[0];
	if (req.files.profilePicture) profileFile = req.files.profilePicture[0];
	if (coverFile) {
		const coverExt = coverFile.mimetype.split("/")[1];
		const coverfilename = `cover-${req.user._id}-${new Date(Date.now())
			.toUTCString()
			.replaceAll(":", "-")
			.replaceAll(",", "-")
			.replaceAll(" ", "-")}.${coverExt}`;
		await sharp(coverFile.buffer)
			.resize(1920, 1080)
			.toFormat("jpeg")
			.jpeg({ quality: 100 })
			.toFile(`../client/public/images/${coverfilename}`);

		req.body.coverPicture = coverfilename;
	}
	if (profileFile) {
		const profileExt = profileFile.mimetype.split("/")[1];
		const profilefilename = `profile-${req.user._id}-${new Date(Date.now())
			.toUTCString()
			.replaceAll(":", "-")
			.replaceAll(",", "-")
			.replaceAll(" ", "-")}.${profileExt}`;
		await sharp(profileFile.buffer)
			.resize(500, 500, { position: "top" })
			.toFormat("jpeg")
			.jpeg({ quality: 100 })
			.toFile(`../client/public/images/${profilefilename}`);

		req.body.profilePicture = profilefilename;
	}
	next();
});

const upload = multer({ storage: multerStorage });
const router = express.Router();

router.get("/me", authController.protect, userController.getMe);

router.get(
	"/",
	authController.protect,
	authController.adminRightsCheck,
	userController.getAllUsers
);

router.get("/search", authController.protect,userController.getSearchUsers);

router
	.route("/:user?")
	.get(userController.checkUser, userController.getUser)
	.patch(
		authController.protect,
		upload.fields([
			{ name: "profilePicture", maxCount: 1 },
			{ name: "coverPicture", maxCount: 1 },
		]),
		imageConfigure,
		userController.update
	);
router.patch("/:id/follow", authController.protect, userController.followUser);
router.patch(
	"/:id/unfollow",
	authController.protect,
	userController.unfollowUser
);
router.get("/:id?/followers", userController.showFollowers);
router.get(
	"/:id?/following",
	authController.protect,
	userController.showFollowing
);
module.exports = router;
/* routes for 
                    GET /api/users/:id
                    PATCH /api/users/:id
                    PATCH /api/users/:id/follow
                    PATCH /api/users/:id/unfollow
                    GET /api/users/:username
                    GET /:id?/followers
                    GET /:id?/following
*/
/*recap
for handling  user information exluding the authentication
*/
