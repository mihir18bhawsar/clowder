import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import messageReducer from "./messageReducer";
import userReducer from "./userReducer";
import postReducer from "./postReducer";
import cacheUserReducer from "./cacheUserReducer";
import searchResultReducer from "./searchResultReducer";
import conversationReducer from "./conversationReducer";
import chatMessageReducer from "./chatMessageReducer";
const allReducers = combineReducers({
	error: errorReducer,
	auth: authReducer,
	user: userReducer,
	form: formReducer,
	message: messageReducer,
	post: postReducer,
	cacheUser: cacheUserReducer,
	searchResult: searchResultReducer,
	conversation: conversationReducer,
	chatMessage: chatMessageReducer,
});
const rootReducer = (state, action) => {
	if (action.type === "USER_SESSION_OVER") {
		state = undefined;
	}
	return allReducers(state, action);
};
export default rootReducer;
