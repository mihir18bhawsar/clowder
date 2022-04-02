import social from "../apis/social";
import history from "../history";
import messageAndError from "./messageAndError";
const createPost = (formData) => async (dispatch) => {
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
};

const exp = { createPost, getPosts };
export default exp;
