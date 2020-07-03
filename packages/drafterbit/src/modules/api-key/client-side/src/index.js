import React, { lazy } from 'react';
import stateReducer from './stateReducer';
import ApiClient from './ApiClient';
const ApiKeyNew = lazy(() => import('./components/ApiKeyNew'));
const ApiKeyEdit = lazy(() => import('./components/ApiKeyEdit'));
const ApiKeys = lazy(() => import('./components/ApiKeys'));
import {
    KeyOutlined,
} from '@ant-design/icons'

(($dt) => {

    $dt.addModule({
        name: "api_key",
        stateReducer: stateReducer,
        routes: [
            {path: "/api_keys/new", component: ApiKeyNew},
            {path: "/api_keys/:api_key_id", component: ApiKeyEdit},
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