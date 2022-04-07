import history from "../history";
import Cookies from "js-cookie";
import social from "../apis/social";
import messageAndError from "./messageAndError";

const login = ({ email, password }) => {
	return async (dispatch, getState) => {
		try {
			const resolved = await social.post("/auth/login", {
				email,
				password,
			});
			dispatch({ type: "LOGIN", payload: resolved.data.token });
			Cookies.set("token", resolved.data.token, {
				expires: 1 / 24,
			});
			window.setTimeout(() => {
				// getState().auth.isLoggedIn = false;
				// getState().auth.token = "";
				dispatch({ type: "USER_SESSION_OVER", payload: null });
				dispatch(
					messageAndError.errorShow(
						401,
						"session expired login again"
					)
				);
				history.push("/login");
			}, 1000 * 60 * 60);
			history.push("/");
		} catch (err) {
			dispatch(
				messageAndError.errorShow(
					err.response?.status || 500,
					err.response?.data.message || "Server unable at the moment"
				)
			);
		}
	};
};
const logout = () => async (dispatch) => {
	Cookies.set("token", ""); //for state based conditional rendering
	dispatch({ type: "LOGOUT", payload: null });
	dispatch({ type: "USER_SESSION_OVER", payload: null });
};

const register = ({ username, email, password }) => {
	return async (dispatch) => {
		try {
			const user = await social.post("/auth/register", {
				username,
				email,
				password,
			});
			dispatch({ type: "REGISTER", payload: user.data.token });
			Cookies.set("token", user.data.token, { expires: 1 / 24 });
			history.push("/");
		} catch (err) {
			dispatch(
				messageAndError.errorShow(
					err.response?.status || 500,
					err.response?.data.message || "Server unable at the moment"
				)
			);
		}
	};
};

const exp = { login, logout, register };
export default exp;
