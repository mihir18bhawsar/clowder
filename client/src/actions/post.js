import social from "../apis/social";
import history from "../history";
import messageAndError from "./messageAndError";
const createPost = (formData) => async (dispatch, getState) => {
	try {
		const post = await social.post("/posts", formData, {
			headers: {
				"Content-Type": "multipart/form-data", //req.body cant handle this user multer
			},
		});
		history.push("/");
		dispatch({
			type: "CREATE_POST",
			payload: { [post.data.data.post._id]: post.data.data.post },
		});
		dispatch(messageAndError.messageShow("post created"));
		getState().socket.emit("newPost", post.data.data.post._id);
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const getPost = (id) => async (dispatch) => {
	try {
		const res = await social.get(`/posts/${id}`);
		const payload = { [res.data.post._id]: res.data.post };
		dispatch({ type: "GET_POST", payload });
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const getPosts = () => async (dispatch) => {
	try {
		const posts = await social.get("/posts");
		const myPosts = posts.data.data.myPosts;
		const timeline = posts.data.data.timeline;
		const mypostsArray = myPosts.map((post) => {
			return { [post._id]: post };
		});
		const timelineArray = timeline.map((post) => {
			return { [post._id]: post };
		});
		const myPostsObject = Object.assign({}, ...mypostsArray);
		const timelineObject = Object.assign({}, ...timelineArray);
		dispatch({
			type: "GET_POSTS",
			payload: { me: myPostsObject, timeline: timelineObject },
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

const like = (id) => async (dispatch, getState) => {
	try {
		await social.patch(`/posts/${id}/like`);
		await dispatch(getPost(id));
		dispatch({ type: "LIKE", payload: null });
		getState().socket.emit("newPost", id);
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const dislike = (id) => async (dispatch, getState) => {
	try {
		await social.patch(`/posts/${id}/dislike`);
		await dispatch(getPost(id));
		dispatch({ type: "DISLIKE", payload: null });
		getState().socket.emit("newPost", id);
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const exp = { createPost, getPost, getPosts, like, dislike };
export default exp;
