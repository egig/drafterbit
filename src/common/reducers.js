import { combineReducers } from 'redux';
import userReducer from './modules/user/reducer';
import projectReducer from './modules/project/reducer';
import commonReducer from './modules/common/reducer';

const rootReducer = combineReducers({
    common: commonReducer,
    user: userReducer,
    project: projectReducer
});

module.exports = rootReducer;
