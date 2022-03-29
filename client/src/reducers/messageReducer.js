const red = (state = "", action) => {
	if (action.type === "MESSAGE_SHOW") {
		return action.payload;
	}
	if (action.type === "MESSAGE_CLOSE") return "";
	return state;
};
export default red;
