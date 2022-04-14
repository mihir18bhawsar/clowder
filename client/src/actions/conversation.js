import social from "../apis/social";
import messageAndError from "./messageAndError";
const getMyConversations = () => async (dispatch) => {
	try {
		const res = await social.get("/conversations/me");
		const conversationsList = res.data.data.conversations;
		if (!conversationsList.length) return;
		let conversations = conversationsList.map((con) => {
			return { [con._id]: con };
		});
		conversations = Object.assign(...conversations);
		dispatch({ type: "GET_MY_CONVERSATIONS", payload: conversations });
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const createNewConversation = (receiver) => async (dispatch, getState) => {
	try {
		await social.post("/conversations", {
			sender: getState().user.me._id,
			receiver,
		});
		dispatch(getMyConversations());
		getState().socket.emit("newConversation", receiver);
	} catch (err) {
		dispatch(
			messageAndError.errorShow(
				err.response?.status || 500,
				err.response?.data.message || "server unavailable"
			)
		);
	}
};

const exp = { getMyConversations, createNewConversation };
export default exp;
