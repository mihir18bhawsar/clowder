const INITIAL_STATE = {
	me: [],
	timeline: [],
};
const postReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "CREATE_POST": {
			return { ...state, me: [...state.me, action.payload] };
		}
		case "GET_POSTS": {
			const me = [...action.payload.myPosts];
			const timeline = [...action.payload.timeline];
			return {
				...state,
				me: [...state.me, ...me],
				timeline: [...state.timeline, ...timeline],
			};
		}
		default: {
			return state;
		}
	}
};

export default postReducer;
