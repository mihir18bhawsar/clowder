const red = (state = "", action) => {
	if (action.type === "ERROR_SHOW") {
		return action.payload;
	}
	if (action.type === "ERROR_CLOSE") return "";
	return state;
};
export default red;
