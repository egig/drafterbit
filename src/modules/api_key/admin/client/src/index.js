import React, { lazy } from 'react';
import reducer from './reducer';
import { Redirect } from 'react-router-dom';

const ApiKeyNew = lazy(() => import('./components/ApiKeyNew'));
const ApiKeyEdit = lazy(() => import('./components/ApiKeyEdit'));
const ApiKeys = lazy(() => import('./components/ApiKeys'));

function createApiKeyClientModule(drafterbit) {

    return {
        name: "api_key",
        stateName: "API_KEY",
        defaultState: {
        },
        reducer: reducer,
        routes: [
            {path: "/api_keys/new", component: ApiKeyNew},                
            {path: "/api_keys/:api_key_id", component: ApiKeyEdit},                
            {path: "/api_keys", component: ApiKeys},
        ],
        generalMenus: [
            {link: "/api_keys", label: "Api Keys", iconClass: "icon-key"}
        ],
        // renderMenuSection() {
        //     return <MenuSection />
        // },
        // processRoute(route) {
        //     //..
        // }
    }
}

window.__DRAFTERBIT__.addModule(createApiKeyClientModule(window.__DRAFTERBIT__))