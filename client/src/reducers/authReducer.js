const INITIAL_STATE = {
	token: "",
	isLoggedIn: false,
};
const red = (state = INITIAL_STATE, action) => {
	if (action.type === "LOGIN") {
		return { ...state, isLoggedIn: true, token: action.payload };
	}
	if (action.type === "REGISTER") {
		return { ...state, isLoggedIn: true, token: action.payload };
	}
	return state;
};
export default red;
