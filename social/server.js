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
	socket.on("reload", (username, userId, profilePicture) => {
		// console.log("reload", onlineUsers);
		currentUserId = userId;
		onlineUsers[userId] = {
			username,
			profilePicture,
			_id: userId,
			socket_ID: socket.id,
		};
		io.emit("onlineUsersUpdated", onlineUsers);

		socket.join(["online_cats", `${userId}`]);
	});
	// adds newly logged in user to the list and updates the current user id on server side ... triggered on login hit
	socket.on("login", (username, userId, profilePicture) => {
		currentUserId = userId;
		onlineUsers[userId] = {
			username,
			profilePicture,
			_id: userId,
			socket_ID: socket.id,
		};
		io.emit("onlineUsersUpdated", onlineUsers);

		socket.join(["online_cats", `${userId}`]);
	});
	// removes the logged out user from onlineusers list
	socket.on("logout", (userId) => {
		delete onlineUsers[userId];
		io.emit("onlineUsersUpdated", onlineUsers);

		socket.leave("online_cats");
	});
	// for connection close... triggers before reload ... on application close
	socket.on("disconnect", () => {
		delete onlineUsers[currentUserId];
		io.emit("onlineUsersUpdated", onlineUsers);

		socket.leave("online_cats");
	});

	socket.on("newPost", (id) => {
		socket.to("online_cats").emit("postsUpdated", id);
	});

	socket.on("followed", (id) => {
		socket.to(`${id}`).emit("follower_added", currentUserId);
	});
	socket.on("unfollowed", (id) => {
		socket.to(`${id}`).emit("follower_left", currentUserId);
	});
	socket.on("newMessage", (receiver, senderName, conversation) => {
		socket.to(receiver).emit("updateMessages", conversation, senderName);
	});
	socket.on("newConversation", (receiver) => {
		socket.to(receiver).emit("updateConversations", currentUserId);
	});
});
