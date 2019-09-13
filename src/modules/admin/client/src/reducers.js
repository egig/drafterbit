import { combineReducers } from 'redux';
import commonReducer from './modules/common/reducer'

export default function createRootReducer(drafterbit) {

    let reducerMap = {
        COMMON: commonReducer
    }
    drafterbit.modules.map(mo => {
        reducerMap[mo.stateName] = mo.reducer;
    })

    let rootReducer = combineReducers(reducerMap);

    return rootReducer
}
