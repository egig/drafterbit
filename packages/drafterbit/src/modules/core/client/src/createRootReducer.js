import { combineReducers } from 'redux';

export default function createRootReducer(drafterbit) {

    let reducerMap = {};
    drafterbit.modules.map(mo => {
        if(mo.stateReducer) {
            reducerMap[mo.stateReducer.stateName] = mo.stateReducer.reducer;
        }
    });

    return combineReducers(reducerMap);
}
