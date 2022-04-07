import social from "../apis/social";
import _ from "lodash";

const getMessagesByConversation = (convid) => async (dispatch) => {
	const messages = await social.get(`/messages/${convid}`);
	dispatch({
		type: "GET_MESSAGES_BY_CONVERSATION",
		payload: _.orderBy(messages.data.data.messages, "createdAt"),
	});
};

const createNewMessage = (text, conversation) => async (dispatch) => {
	await social.post("/messages", { text, conversation });
	dispatch(getMessagesByConversation(conversation));
};

const exp = { getMessagesByConversation, createNewMessage };
export default exp;
