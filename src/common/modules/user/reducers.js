const userReducer = function (state = {}, action) {
	switch (action.type) {
		case 'USER_GET_LIST_SUCCESS':
			return Object.assign({}, state, {
				users: action.payload,
			});
	}
	return state;
};

export default userReducer;