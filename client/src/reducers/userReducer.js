const INITIAL_STATE = {
	me: {},
	followers: {},
	following: {},
	users: {},
};

const red = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "GET_USER":
			return { ...state, users: action.payload };
		case "GET_ME":
			return { ...state, me: action.payload };
		case "GET_FOLLOWING": {
			return { ...state, ...action.payload };
		}
		case "GET_FOLLOWERS": {
			return { ...state, ...action.payload };
		}
		default:
			return state;
	}
};
export default red;
