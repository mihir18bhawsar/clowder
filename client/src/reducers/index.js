import { combineReducers } from "redux";
import authReducer from "./authReducer";
import { reducer as formReducer } from "redux-form";
import errorReducer from "./errorReducer";
import messageReducer from "./messageReducer";
import userReducer from "./userReducer";
import postReducer from "./postReducer";
import cacheUserReducer from "./cacheUserReducer";
import searchResultReducer from "./searchResultReducer";
export default combineReducers({
	error: errorReducer,
	auth: authReducer,
	user: userReducer,
	form: formReducer,
	message: messageReducer,
	post: postReducer,
	cacheUser: cacheUserReducer,
	searchResult: searchResultReducer,
});
