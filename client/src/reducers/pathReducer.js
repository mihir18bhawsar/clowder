const red = (state = "", action) => {
	if (action.type === "PATH_SET") {
		return action.payload;
	}
	return state;
};
export default red;
