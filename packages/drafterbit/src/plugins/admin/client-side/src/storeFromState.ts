import { createStore, applyMiddleware } from  'redux';
import thunk from 'redux-thunk';
import createRootReducer from './createRootReducer';
import ClientSide from "./ClientSide";

const middlewares = [thunk];

export = function storeFromState(defaultState: any, drafterbit: ClientSide) {
    return createStore(createRootReducer(drafterbit), defaultState, applyMiddleware(...middlewares));
}
