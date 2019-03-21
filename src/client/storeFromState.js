import { createStore, applyMiddleware } from  'redux';
import thunk from 'redux-thunk';

// import root reducers
const rootReducer = require('./reducers');

const middlewares = [thunk];

export default function storeFromState(defaultState) {
    return createStore(rootReducer, defaultState, applyMiddleware(...middlewares));
};
