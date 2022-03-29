const express = require("express");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router
    .route("/:id")
    .get(postController.getPost)
    .patch(authController.protect, userController.updatePost)
    .delete(authController.protect, userController.deletePost);
router.post("/:id/like", authController.protect, userController.likePost);
router.post("/:id/dislike", authController.protect, userController.dislikePost);
router.get("/:id/likes", postController.getLikes);
router.get("/:id/dislikes", postController.getDislikes);
router
    .route("/")
    .post(authController.protect, userController.createPost)
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
