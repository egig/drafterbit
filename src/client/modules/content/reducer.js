export default function reducer(state = {}, action) {
    switch (action.type) {
    case '@content/SET_CT_FIELD':
        return Object.assign({}, state, {
            ctFields: action.payload
        });
    case '@content/SET_CONTENTS':
        return Object.assign({}, state, {
            contents: action.payload
        });
    }

    return state;
}

