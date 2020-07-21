function reducer(state = {}, action: any) {
    switch (action.type) {
    case 'AUTH_SET_USER':
        return Object.assign({}, state, {
            currentUser: action.payload
        });
    }

    return state;
}

export default {
    stateName: 'USER',
    defaultState: {
        currentUser: null,
        token: null,
        users: []
    },
    reducer
};