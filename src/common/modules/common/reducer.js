export default function reducer(state = {}, action) {
	switch (action.type) {
		case '@common/SET_AJAX_LOADING':
			return Object.assign({}, state, {
				isAjaxLoading: action.payload
			});
	}

	return state;
}
