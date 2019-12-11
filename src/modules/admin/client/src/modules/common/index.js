import React  from 'react';
import Dashboard from './components/Dashboard';
import MenuSection from './components/MenuSection';

function createCommonModule(drafterbit) {

    return {
        name: "main",
        stateName: "COMMON",
        defaultState: {
        },
        // reducer: reducer,
        routes: [
            {path: "/", component: Dashboard},
        ],
        generalMenus: [
            // {link: "/content_types", label: "Content Types", iconClass: "icon-puzzle"}
        ],
        renderMenuSection(i) {
            return <MenuSection key={i} />
        },
        processRoute(route) {
            //..
        }
    }
}

window.__DRAFTERBIT__.addModule(createCommonModule(window.__DRAFTERBIT__));