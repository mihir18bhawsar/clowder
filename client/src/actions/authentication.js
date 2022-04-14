import history from "../history";
import Cookies from "js-cookie";
import social from "../apis/social";
import messageAndError from "./messageAndError";
import { setSocket } from ".";

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
			history.push("/");
			dispatch(messageAndError.messageShow("Logged In successfully!"));
			getState().socket.emit(
				"login",
				resolved.data.username,
				resolved.data.userId,
				resolved.data.profilePicture
			);
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
const logout = () => async (dispatch, getState) => {
	try {
		const socket = getState().socket;
		const id = getState().user.me._id;
		Cookies.remove("token");
		dispatch({ type: "USER_SESSION_OVER", payload: null });
		dispatch({ type: "LOGOUT", payload: null });
		await dispatch(
			messageAndError.messageShow("Session Expired / Logged Out")
		);
		history.push("/login");
		dispatch(setSocket(socket));
		socket.emit("logout", id);
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "Server unable at the moment"
			)
		);
	}
};

const register = ({ username, email, password }) => {
	return async (dispatch, getState) => {
		try {
			const user = await social.post("/auth/register", {
				username,
				email,
				password,
			});
			dispatch({ type: "REGISTER", payload: user.data.token });
			Cookies.set("token", user.data.token, { expires: 1 / 24 });
			history.push("/");
			dispatch(messageAndError.messageShow("Registered successfully!"));
			getState().socket.emit(
				"login",
				user.data.data.user.username,
				user.data.data.user._id,
				user.data.data.user.profilePicture
			);
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
