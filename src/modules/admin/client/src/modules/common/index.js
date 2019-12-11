import React  from 'react';
import Dashboard from './components/Dashboard';
import MenuSection from './components/MenuSection';
import stateReducer from './stateReducer';

function createCommonModule(drafterbit) {

    return {
        name: "common",
        stateReducer: stateReducer,
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