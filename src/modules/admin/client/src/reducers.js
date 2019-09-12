import { combineReducers } from 'redux';
import userReducer from './modules/user/reducer';
import commonReducer from './modules/common/reducer';
import contentReducer from './modules/content/reducer';
import apiKeyReducer from './modules/api_key/reducer';

const rootReducer = combineReducers({
    COMMON: commonReducer,
    USER: userReducer,
    CONTENT: contentReducer,
    API_KEY: apiKeyReducer,
});

export default rootReducer;
