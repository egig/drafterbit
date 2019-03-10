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


    }

    return state;
}
