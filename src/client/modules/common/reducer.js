export default function reducer(state = {}, action) {
    switch (action.type) {
    case '@common/SET_AJAX_LOADING':
        return Object.assign({}, state, {
            isAjaxLoading: action.payload
        });
	    case '@project/SET_CONTENT_TYPES':
		    return Object.assign({}, state, {
			    contentTypes: action.payload
		    });
	    case '@project/SET_CONTENT_TYPE':
		    return Object.assign({}, state, {
			    contentType: action.payload
		    });
	    case '@project/SET_API_KEYS':
		    return Object.assign({}, state, {
			    apiKeys: action.payload
		    });
    }

    return state;
}
