const red = (state = {}, action) => {
	if (action.type === "SET_ONLINE_USERS") {
		return action.payload;
	}
	return state;
};
export default red;
