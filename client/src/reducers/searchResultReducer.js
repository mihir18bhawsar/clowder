const red = (state = [], action) => {
	if (action.type === "GET_SEARCH_USERS") {
		return action.payload;
	}
	return state;
};

export default red;
