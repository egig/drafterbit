export default function createDefaultState(drafterbit) {

    let defaultState = {
        COMMON: {
            language: 'en',
            languages: ['en', 'id'],
            isAjaxLoading: false,
            notifyText: ""
        },
    };

    drafterbit.modules.map(mo => {
        if(!!mo.stateName) {
            defaultState[mo.stateName] = mo.defaultState;
        }
    });

    return defaultState
}
