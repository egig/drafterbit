import { combineReducers } from 'redux';
import userReducer from './modules/user/reducer';
import projectReducer from './modules/project/reducer';
import commonReducer from './modules/common/reducer';
import contentReducer from './modules/content/reducer';

const rootReducer = combineReducers({
    common: commonReducer,
    user: userReducer,
    project: projectReducer,
    content: contentReducer
});

module.exports = rootReducer;
