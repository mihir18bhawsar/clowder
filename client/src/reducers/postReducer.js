const INITIAL_STATE = {
	me: {},
	timeline: {},
};
const postReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "CREATE_POST": {
			return {
				...state,
				me: { ...state.me, ...action.payload },
				timeline: { ...state.timeline, ...action.payload },
			};
		}
		case "GET_POSTS": {
			return Object.assign(state, action.payload);
		}
		case "LIKE": {
			return { ...state };
		}
		case "DISLIKE": {
			return { ...state };
		}
		default: {
			return state;
		}
	}
};

export default postReducer;
