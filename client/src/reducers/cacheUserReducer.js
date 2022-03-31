const cacheUserReducer = (state = null, action) => {
	if (action.type === "CACHE_USER") {
		return action.payload;
	}
	return state;
};
export default cacheUserReducer;
