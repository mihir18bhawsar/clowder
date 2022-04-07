const red = (state = [], action) => {
	if (action.type === "GET_MESSAGES_BY_CONVERSATION") {
		return [...action.payload];
	}
	return state;
};
export default red;
