const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const { getUserPosts } = require("./controllers/userController");

//setup app
const app = express();

// set middlewares
app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/profile/:username", getUserPosts);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
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
		res.status(500).json({
			status: "error",
			message: "some error occured",
		});
	}
});
module.exports = app;
