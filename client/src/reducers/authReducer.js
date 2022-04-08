import Cookies from "js-cookie";
const token = Cookies.get("token");
const INITIAL_STATE = {
	token: token || "",
	isLoggedIn: token ? true : false,
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
