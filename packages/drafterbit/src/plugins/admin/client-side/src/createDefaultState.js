export default function createDefaultState(drafterbit) {

    let defaultState = {};

    drafterbit.modules.map(mo => {
        if(mo.stateReducer) {
            defaultState[mo.stateReducer.stateName] = mo.stateReducer.defaultState;
        }
    });

    return defaultState;
}
