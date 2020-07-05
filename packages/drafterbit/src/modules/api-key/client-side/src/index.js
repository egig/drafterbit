import React, { lazy } from 'react';
import stateReducer from './stateReducer';
import ApiClient from './ApiClient';
const ApiKey = lazy(() => import('./components/ApiKey'));
const ApiKeys = lazy(() => import('./components/ApiKeys'));
import {
    KeyOutlined,
} from '@ant-design/icons'

(($dt) => {

    $dt.addModule({
        name: "api_key",
        stateReducer: stateReducer,
        routes: [
            {path: "/api_keys/:api_key_id", component: ApiKey},
            {path: "/api_keys", component: ApiKeys},
        ],
        generalMenus: [
            {link: "/api_keys", label: "Api Keys", iconClass: "icon-key", icon: <KeyOutlined/>}
        ],
        registerApiClient() {
            return ApiClient
        }
    })

})(window.$dt);