const dotenv = require("dotenv");
const mongoose = require("mongoose");
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
