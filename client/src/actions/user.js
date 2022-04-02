import social from "../apis/social";
import authentication from "./authentication";
import messageAndError from "./messageAndError";
import history from "../history";

const unfollow = (id) => async (dispatch) => {};

const getFollowing = (id) => async (dispatch) => {
	try {
		const resolved = await social.get(`/users/${id}`);
		const following = resolved.data.data.user.following;
		if (following.length < 1) {
			return;
		}
		const followingPromises = following.map(async (id) => {
			return await social.get(`/users/${id}`);
		});
		const responsesArray = await Promise.all(followingPromises);
		const idObjectPairs = responsesArray.map((response) => {
			const eachfollowing = response.data.data.user;
			return { [eachfollowing._id]: eachfollowing };
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
		const resolved = await social.get(`/users/${id}`);
		const followers = resolved.data.data.user.followers;
		if (followers.length < 1) {
			return;
		}
		const followersPromises = followers.map(async (id) => {
			return await social.get(`/users/${id}`);
		});
		const responsesArray = await Promise.all(followersPromises);
		const idObjectPairs = responsesArray.map((response) => {
			const follower = response.data.data.user;
			return { [follower._id]: follower };
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

const exp = {
	getFollowing,
	getFollowers,
	getMe,
	getUser,
	getMeAndMore,
	getUserCache,
	updateMe,
};
export default exp;
