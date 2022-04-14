import social from "../apis/social";
import _ from "lodash";

const getMessagesByConversation =
	(convid, sender = null) =>
	async (dispatch, getState) => {
		if (sender) {
			if (getState().path !== `/chat/${sender}`) {
				return;
			}
		}
		const messages = await social.get(`/messages/${convid}`);
		dispatch({
			type: "GET_MESSAGES_BY_CONVERSATION",
			payload: _.orderBy(messages.data.data.messages, "createdAt"),
		});
	};

const createNewMessage = (text, conversation) => async (dispatch, getState) => {
	const res = await social.post("/messages", { text, conversation });
	await dispatch(getMessagesByConversation(conversation));
	getState().socket.emit(
		"newMessage",
		res.data.data.receiver,
		getState().user.me.username,
		conversation
	);
};

const exp = { getMessagesByConversation, createNewMessage };
export default exp;
