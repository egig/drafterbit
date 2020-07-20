import { combineReducers } from 'redux';
import ClientSide from "./ClientSide";

export = function createRootReducer($dt: ClientSide): any {

    let reducerMap:any = {};
    $dt.modules.map(mo => {
        if(mo.stateReducer) {
            if (mo.stateReducer.stateName !== "") {
                reducerMap[mo.stateReducer.stateName] = mo.stateReducer.reducer;
            }
        }
    });

    return combineReducers(reducerMap);
}
