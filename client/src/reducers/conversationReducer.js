const red = (state = {}, action) => {
	if (action.type === "GET_MY_CONVERSATIONS")
		return { ...state, ...action.payload };
	return state;
};

export default red;