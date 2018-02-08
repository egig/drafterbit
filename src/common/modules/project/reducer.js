export default function reducer(state = {}, action) {
	switch (action.type) {
		case 'PROJECT_SET':
			return Object.assign({}, state, {
				projects: action.payload
			});
	}

	return state;
}
