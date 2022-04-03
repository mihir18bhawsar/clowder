const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const catchAsync = require("../utils/catchAsync");

const multerStorage = multer.memoryStorage();

const imageConfigure = catchAsync(async (req, res, next) => {
	if (!req.file) return next();
	const ext = req.file.mimetype.split("/")[1];
	req.file.filename = `${req.user._id}-${new Date(Date.now())
		.toUTCString()
		.replaceAll(":", "-")
		.replaceAll(",", "-")
		.replaceAll(" ", "-")}.${ext}`;
	await sharp(req.file.buffer)
		.toFormat("jpeg")
		.jpeg({ quality: 70 })
		.toFile(`../client/public/images/${req.file.filename}`);
	req.body.imageName = req.file.filename;
	next();
});

// const fileStorageEngine = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, __dirname + "/../../client/public/images");
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, req.user.username + "-" + file.originalname);
// 	},
// });

const upload = multer({ storage: multerStorage });

const router = express.Router();

router
	.route("/:id")
	.get(postController.getPost)
	.patch(authController.protect, userController.updatePost)
	.delete(authController.protect, userController.deletePost);
router.patch("/:id/like", authController.protect, userController.likePost);
router.patch(
	"/:id/dislike",
	authController.protect,
	userController.dislikePost
);
router.get("/:id/likes", postController.getLikes);
router.get("/:id/dislikes", postController.getDislikes);
router
	.route("/")
	.post(
		authController.protect,
		upload.single("image"),
		imageConfigure,
		userController.createPost
	)
	.get(authController.protect, postController.getTimeline);
module.exports = router;
/* routes for 
                    GET /api/posts/:id
                    PATCH /api/posts/:id
                    DELETE /api/posts/:id
                    POST /api/posts/:id/like
                    POST /api/posts/:id/dislike
                    GET /api/posts/:id/likes
                    GET /api/posts/:id/dislikes
                    POST /api/posts
                    GET /api/posts
*/
