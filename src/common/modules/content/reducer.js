export default function reducer(state = {}, action) {
	switch (action.type) {
		case '@content/SET_CT_FIELD':
			return Object.assign({}, state, {
				ctFields: action.payload
			});
	}

	return state;
}

