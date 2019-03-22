import { createStore, applyMiddleware } from  'redux';
import thunk from 'redux-thunk';
import  rootReducer from './reducers';

const middlewares = [thunk];

export default function storeFromState(defaultState) {
    return createStore(rootReducer, defaultState, applyMiddleware(...middlewares));
};
