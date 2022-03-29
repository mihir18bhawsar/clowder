const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/me", authController.protect, userController.getMe);

router.get(
	"/",
	authController.protect,
	authController.adminRightsCheck,
	userController.getAllUsers
);
router
	.route("/:user")
	.get(userController.checkUser, userController.getUser)
	.patch(
		authController.protect,
		authController.adminRightsCheck,
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
