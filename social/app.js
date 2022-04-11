const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const conversationRouter = require("./routes/conversationRoutes");
const messageRouter = require("./routes/messageRoutes");
const { getUserPosts } = require("./controllers/userController");

//setup app
const app = express();

// set middlewares

const limiter = rateLimit({
	windowMs: 3000,
	max: 50,
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../client/public")));

app.get("/api/profile/:username", getUserPosts);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.all("*", (req, res, next) => {
	res.status(404).json({
		status: "fail",
		message: `cant find ${req.originalUrl} on this server`,
	});
});
app.use((err, req, res, next) => {
	if (err.isOperational) {
		res.status(err.statusCode || 500).json({
			status: err.status || "error",
			message: err.message || "some error occured",
		});
	} else {
		console.log(err.name, err.message, err.stack);
		if (err.name === "CastError")
			res.status(400).json({
				status: "error",
				message: `invalid data sent ${err.path}: ${err.value}`,
			});
		if (err.code === 11000) {
			res.status(400).json({
				status: "error",
				message: "Already exists! Try again with different value",
			});
		}
		if (err.name === "ValidationError") {
			const message = Object.values(err.errors)
				.map((val) => val.message)
				.join(" | ");
			res.status(400).json({ status: "error", message });
		}
		res.status(500).json({
			status: "error",
			message: "some error occured",
		});
	}
});
module.exports = app;
