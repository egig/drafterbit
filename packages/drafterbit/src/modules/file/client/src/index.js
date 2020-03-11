import React, { lazy } from 'react';
// import reducer from './reducer';

const Files = lazy(() => import('./components/Files'));
// const ApiKeyEdit = lazy(() => import('./components/ApiKeyEdit'));
// const ApiKeys = lazy(() => import('./components/ApiKeys'));

function createFileClientModule(drafterbit) {

    return {
        name: "file",
        stateName: "FILES",
        defaultState: {
        },
        // reducer: reducer,
        routes: [
            {path: "/files", component: Files},
            // {path: "/api_keys/:api_key_id", component: ApiKeyEdit},
            // {path: "/api_keys", component: ApiKeys},
        ],
        generalMenus: [
            {link: "/files", label: "Files", iconClass: "icon-folder"}
        ],
        // renderMenuSection() {
        //     return <MenuSection />
        // },
        // processRoute(route) {
        //     //..
        // }
    }
}

window.__DRAFTERBIT__.addModule(createFileClientModule(window.__DRAFTERBIT__));