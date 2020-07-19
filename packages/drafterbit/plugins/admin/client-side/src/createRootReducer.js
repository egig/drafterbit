import { combineReducers } from 'redux';

export default function createRootReducer($dt) {

    let reducerMap = {};
    $dt.modules.map(mo => {
        if(mo.stateReducer) {
            reducerMap[mo.stateReducer.stateName] = mo.stateReducer.reducer;
        }
    });

    return combineReducers(reducerMap);
}
