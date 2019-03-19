const { SET_CONTENT_TYPES, SET_CONTENT_TYPE } = require('./action_types');

export default function reducer(state = {}, action) {
    switch (action.type) {
    case SET_CONTENT_TYPES:
	    return Object.assign({}, state, {
		    contentTypes: action.payload
	    });
    case SET_CONTENT_TYPE:
	    return Object.assign({}, state, {
		    contentType: action.payload
	    });

    }

    return state;
}
