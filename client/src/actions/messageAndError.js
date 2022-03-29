import history from "../history";

const errorShow = (errcode, message) => async (dispatch) => {
	if (errcode === 401) history.push("/login");
	dispatch({ type: "ERROR_SHOW", payload: message });
	window.setTimeout(() => {
		dispatch(errorClose());
	}, 3000);
};

const errorClose = () => {
	return { type: "ERROR_CLOSE", payload: null };
};
const messageShow = (message) => async (dispatch) => {
	dispatch({ type: "MESSAGE_SHOW", payload: message });
	window.setTimeout(() => {
		dispatch(messageClose());
	}, 3000);
};

const messageClose = () => {
	return { type: "MESSAGE_CLOSE", payload: null };
};

const exp =  { errorShow, errorClose, messageShow, messageClose };
export default exp;