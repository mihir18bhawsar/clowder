const dotenv = require("dotenv");
const mongoose = require("mongoose");

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
