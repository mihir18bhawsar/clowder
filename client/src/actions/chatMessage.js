import social from "../apis/social";

const getMessagesByConversation = (convid) => async (dispatch) => {
	const messages = await social.get(`/messages/${convid}`);
	dispatch({
		type: "GET_MESSAGES_BY_CONVERSATION",
		payload: messages.data.data.messages,
	});
};
const exp = { getMessagesByConversation };
export default exp;
