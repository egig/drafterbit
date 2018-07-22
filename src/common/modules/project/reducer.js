export default function reducer(state = {}, action) {
    switch (action.type) {
    case '@project/SET_PROJECTS':
        return Object.assign({}, state, {
            projects: action.payload
        });
    case '@project/SET_PROJECT':
        return Object.assign({}, state, {
            project: action.payload
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
