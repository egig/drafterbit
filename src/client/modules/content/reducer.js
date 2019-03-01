export default function reducer(state = {}, action) {
    switch (action.type) {
    case '@content/SET_CT_FIELD':
        return Object.assign({}, state, {
            ctFields: action.payload
        });
        break;
    case '@content/SET_CONTENTS':
        return Object.assign({}, state, {
            contents: action.payload
        });
        break;
    case '@content/SET_CONTENT':
	    return Object.assign({}, state, {
		    content: action.payload
	    });
    }

    return state;
}

