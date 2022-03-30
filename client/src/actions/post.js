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
		dispatch({ type: "CREATE_POST", payload: post.data.data.post });
		history.push("/");
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
	dispatch({ type: "GET_POSTS", payload: posts.data.data });
};

const exp = { createPost, getPosts };
export default exp;
