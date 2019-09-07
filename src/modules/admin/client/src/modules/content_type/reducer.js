import { SET_CONTENT_TYPES } from './action_types';

export default function reducer(state = {}, action) {
    switch (action.type) {
    case SET_CONTENT_TYPES:
	    return Object.assign({}, state, {
		    contentTypes: action.payload
	    });
    }

    return state;
}
