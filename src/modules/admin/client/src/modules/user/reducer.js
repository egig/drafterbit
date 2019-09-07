export default function reducer(state = {}, action) {
    switch (action.type) {
    case 'AUTH_SET_USER':
        return Object.assign({}, state, {
            currentUser: action.payload
        });
    }

    return state;
}
