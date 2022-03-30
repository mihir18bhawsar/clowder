import { combineReducers } from "redux";
import authReducer from "./authReducer";
import { reducer as formReducer } from "redux-form";
import errorReducer from "./errorReducer";
import messageReducer from "./messageReducer";
import userReducer from "./userReducer";
import postReducer from "./postReducer";

export default combineReducers({
	error: errorReducer,
	auth: authReducer,
	user: userReducer,
	form: formReducer,
	message: messageReducer,
	post: postReducer,
});
