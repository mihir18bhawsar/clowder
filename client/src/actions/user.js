import social from "../apis/social";
import authentication from "./authentication";
import messageAndError from "./messageAndError";
import history from "../history";
import { getPosts } from ".";

const unfollow = (id) => async (dispatch, getState) => {
	try {
		const res = await social.patch(`/users/${id}/unfollow`);
		dispatch(messageAndError.messageShow(res.data.message));
		await dispatch(getMeAndMore());
		await dispatch(getUserCache(id));
		await dispatch(getPosts());
		dispatch({ type: "UNFOLLOW_USER", payload: null });
		getState().socket.emit("unfollowed", id);
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const follow = (id) => async (dispatch, getState) => {
	try {
		const res = await social.patch(`/users/${id}/follow`);
		dispatch(messageAndError.messageShow(res.data.message));
		await dispatch(getUserCache(id));
		await dispatch(getMeAndMore());
		await dispatch(getPosts());
		dispatch({ type: "FOLLOW_USER", payload: null });
		getState().socket.emit("followed", id);
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const getFollowing = (id) => async (dispatch) => {
	try {
		const resolved = await social.get(`/users/${id}/following`);
		const following = resolved.data.data.following;
		if (following.length < 1) {
			dispatch({
				type: "GET_FOLLOWING",
				payload: {},
			});
			return;
		}

		const idObjectPairs = following.map((one) => {
			return { [one._id]: one };
		});
		const followingList = Object.assign(...idObjectPairs);
		dispatch({
			type: "GET_FOLLOWING",
			payload: followingList,
		});
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};
const getFollowers = (id) => async (dispatch) => {
	try {
		const resolved = await social.get(`/users/${id}/followers`);
		const followers = resolved.data.data.followers;
		if (followers.length < 1) {
			dispatch({ type: "GET_FOLLOWERS", payload: {} });
			return;
		}
		const idObjectPairs = followers.map((one) => {
			return { [one._id]: one };
		});
		const followersList = Object.assign(...idObjectPairs);
		dispatch({
			type: "GET_FOLLOWERS",
			payload: followersList,
		});
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const getUser = (id) => async (dispatch) => {
	try {
		const response = await social.get(`/users/${id}`);
		dispatch({ type: "GET_USER", payload: response.data.data.user });
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const getMe = () => async (dispatch) => {
	try {
		const response = await social.get(`/users/me`);
		dispatch({ type: "GET_ME", payload: response.data.data.user });
	} catch (err) {
		if (err.response.status === 404) {
			dispatch(authentication.logout());
			history.push("/login");
		}
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};
const getMeAndMore = () => async (dispatch) => {
	try {
		// dont forget, every action triggers a state change
		const response = await social.get(`/users/me`);
		dispatch({ type: "GET_USER", payload: response.data.data.user });
		await dispatch(getFollowing(response.data.data.user._id));
		await dispatch(getFollowers(response.data.data.user._id));
		await dispatch(getMe());
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const getUserCache = (id) => async (dispatch) => {
	try {
		const response = await social.get(`/users/${id}`);
		dispatch({ type: "CACHE_USER", payload: response.data.data.user });
		dispatch(getUser(id));
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const updateMe = (formData) => async (dispatch) => {
	try {
		const user = await social.patch(`/users`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		history.push("/profile");
		dispatch({ type: "UPDATE_ME", payload: user.data.data.user });
		dispatch(messageAndError.messageShow("Updated Successfully"));
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const getSearchUsers = (term) => async (dispatch) => {
	try {
		const res = await social.get(`/users/search?term=${term}`);
		dispatch({ type: "GET_SEARCH_USERS", payload: res.data.result });
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const exp = {
	getFollowing,
	getFollowers,
	getMe,
	getUser,
	getMeAndMore,
	getUserCache,
	updateMe,
	follow,
	unfollow,
	getSearchUsers,
};
export default exp;
