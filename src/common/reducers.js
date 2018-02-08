import { combineReducers } from 'redux';
import userReducer from './modules/user/reducer';
import projectReducer from './modules/project/reducer';

const rootReducer = combineReducers({
    user: userReducer,
    project: projectReducer
});

module.exports = rootReducer;
