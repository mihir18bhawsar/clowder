module.exports = class AppError extends Error {
	constructor(code, message) {
		super(message);
		if (code.toString().startsWith("4")) this.status = "client error";
		else this.status = "server error";
		this.statusCode = code;
		this.isOperational = true;
	}
};
