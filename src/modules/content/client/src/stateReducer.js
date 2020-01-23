import { SET_CONTENT_TYPES } from './action_types';

let defaultState = {
    content: {
        fields: []
    },
    contents: [],
    ctFields: {fields: []},
    contentType: {
        fields: []
    },
    contentTypes: []
};

export default {
    stateName: 'CONTENT',
    defaultState,
    reducer: function reducer(state = defaultState, action) {
        switch (action.type) {
        case '@content/SET_CT_FIELD':
            return Object.assign({}, state, {
                ctFields: action.payload
            });
        case '@content/SET_CONTENTS':
            return Object.assign({}, state, {
                contents: action.payload
            });
        case '@content/SET_CONTENT':
            return Object.assign({}, state, {
                content: action.payload
            });
        case SET_CONTENT_TYPES:
            return Object.assign({}, state, {
                contentTypes: action.payload
            });
        }

        return state;
    }
};

