const dotenv = require("dotenv");
const mongoose = require("mongoose");
const socket = require("socket.io");

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

const app = require("./app");
dotenv.config({ path: "./config.env" });

//setup database
const dbString = process.env.DATABASE_STRING.replace(
	"<password>",
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(dbString, {
		useNewUrlParser: true, //old is deprecated
	})
	.then(() => {
		console.log("Connected to mongoose");
	})
	.catch((err) => console.log(err));

//start server
const server = app.listen(process.env.PORT, () => {
	console.log(`Server started on port ${process.env.port}`);
});

process.on("unhandledRejection", (err) => {
	console.log("Unhandled Rejection! 💥 Shutting down...");
	console.log(err.name, err.message);
	server.close(() => process.exit(1));
});
process.on("SIGTERM", () => {
	server.close(() => {
		console.log("process terminated");
	});
});

const io = socket(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});
const onlineUsers = {};
io.on("connection", (socket) => {
	let currentUserId;
	// on application refresh ... on application close and reopen ... triggered only if already logged in
	socket.on("reload", (username, userId) => {
		console.log("reload", onlineUsers);
		currentUserId = userId;
		onlineUsers[userId] = username;
		io.emit("onlineUsersUpdated", onlineUsers);
	});
	// adds newly logged in user to the list and updates the current user id on server side ... triggered on login hit
	socket.on("login", (username, userId) => {
		currentUserId = userId;
		onlineUsers[userId] = username;
		io.emit("onlineUsersUpdated", onlineUsers);
	});
	// removes the logged out user from onlineusers list
	socket.on("logout", (userId) => {
		delete onlineUsers[userId];
		io.emit("onlineUsersUpdated", onlineUsers);
	});
	// for connection close... triggers before reload ... on application close
	socket.on("disconnect", () => {
		delete onlineUsers[currentUserId];
		io.emit("onlineUsersUpdated", onlineUsers);
	});
});
