import Cookies from "js-cookie";
import history from "../history";
import social from "../apis/social";

export const login = ({ email, password }) => {
	return async (dispatch, getState) => {
		social
			.post("/auth/login", { email, password })
			.then((resolved) => {
				dispatch({ type: "LOGIN", payload: resolved.data.token });
				Cookies.set("token", resolved.data.token, {
					expires: 1 / 24,
				});

				history.push("/");
			})
			.catch((err) => {
				dispatch(
					errorShow(
						err.response?.status || 500,
						err.response?.data.message ||
							"Server unable at the moment"
					)
				);
			});
	};
};

export const logout = () => {
	Cookies.set("token", ""); //for state based conditional rendering
	return { type: "LOGOUT", payload: null };
};

export const errorShow = (errcode, message) => async (dispatch) => {
	if (errcode === 401) history.push("/login");
	dispatch({ type: "ERROR_SHOW", payload: message });
	window.setTimeout(() => {
		dispatch(errorClose());
	}, 3000);
};

export const errorClose = () => {
	return { type: "ERROR_CLOSE", payload: null };
};
export const messageShow = (message) => async (dispatch) => {
	dispatch({ type: "MESSAGE_SHOW", payload: message });
	window.setTimeout(() => {
		dispatch(messageClose());
	}, 3000);
};

export const messageClose = () => {
	return { type: "MESSAGE_CLOSE", payload: null };
};
export const getFollowing = () => async (dispatch) => {
	try {
		const resolved = await social.get("/users/me");
		if (resolved.data.data.user.following.length < 1) {
			dispatch({
				type: "GET_FOLLOWING",
				payload: { me: resolved.data.data.user },
			});
			return;
		}
		const followingPromises = resolved.data.data.user.following.map(
			async (id) => {
				return await social.get(`/users/${id}`);
			}
		);
		const followingResponses = await Promise.all(followingPromises);
		const following = followingResponses.map((response) => ({
			[response.data.data.user._id]: response.data.data.user,
		}));
		const followingList = Object.assign(...following);
		dispatch({
			type: "GET_FOLLOWING",
			payload: { me: resolved.data.data.user, following: followingList },
		});
	} catch (err) {
		dispatch(
			errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

export const getFollowers = () => async (dispatch) => {
	try {
		const resolved = await social.get("/users/me");
		if (resolved.data.data.user.followers.length < 1) {
			dispatch({
				type: "GET_FOLLOWERS",
				payload: { me: resolved.data.data.user },
			});
			return;
		}
		const followersPromises = resolved.data.data.user.followers.map(
			async (id) => {
				return await social.get(`/users/${id}`);
			}
		);
		const followersResponses = await Promise.all(followersPromises);
		const followers = followersResponses.map((response) => ({
			[response.data.data.user._id]: response.data.data.user,
		}));
		const followersList = Object.assign(...followers);
		dispatch({
			type: "GET_FOLLOWERS",
			payload: { me: resolved.data.data.user, followers: followersList },
		});
	} catch (err) {
		dispatch(
			errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

export const getUser = (id) => async (dispatch) => {
	try {
		let response;
		if (id.length > 15) {
			response = await social.get(`/users/${id}`);
		} else {
			response = await social.get(`/users/user/${id}`);
		}
		dispatch({ type: "GET_USER", payload: response.data.data.user });
	} catch (err) {
		dispatch(
			errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

export const getMe = () => async (dispatch) => {
	try {
		const response = await social.get(`/users/me`);
		dispatch({ type: "GET_ME", payload: response.data.data.user });
	} catch (err) {
		dispatch(
			errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};
