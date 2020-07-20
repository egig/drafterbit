function reducer(state = {}, action: any) {
    switch (action.type) {
    case '@common/SET_AJAX_LOADING':
        return Object.assign({}, state, {
            isAjaxLoading: action.payload
        });
    }

    return state;
}

export = {
    defaultState: {
        language: 'en',
        languages: ['en', 'id'],
        isAjaxLoading: false,
        settings: {}
    },
    stateName: 'COMMON',
    reducer
};
