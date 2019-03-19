import { combineReducers } from 'redux';
import userReducer from './modules/user/reducer';
import contentTypeReducer from './modules/content_type/reducer';
import commonReducer from './modules/common/reducer';
import contentReducer from './modules/content/reducer';
import apiKeyReducer from './modules/api_key/reducer';

const rootReducer = combineReducers({
    COMMON: commonReducer,
    USER: userReducer,
    CONTENT: contentReducer,
    CONTENT_TYPE: contentTypeReducer,
    API_KEY: apiKeyReducer,
});

module.exports = rootReducer;
