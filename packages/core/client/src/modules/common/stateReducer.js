function reducer(state = {}, action) {
    switch (action.type) {
        case '@common/SET_AJAX_LOADING':
            return Object.assign({}, state, {
                isAjaxLoading: action.payload
            });
        
        case '@common/SET_NOTIFY_TEXT':
            return Object.assign({}, state, {
                notifyText: action.payload
            });
    }

    return state;
}

export default {
    defaultState: {
        language: 'en',
        languages: ['en', 'id'],
        isAjaxLoading: false,
        notifyText: ""
    },
    stateName: "COMMON",
    reducer
}
