import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const Request = lazy(() => import('./components/Request'));

function createSwaggerClientModule(drafterbit) {

    return {
        name: "swagger",
        routes: [
            {path: "/requests", component: Request}
        ],
        generalMenus: [
            {link: "/requests", label: "Requests", iconClass: "icon-target"}
        ],
        // renderMenuSection() {
        //     return <MenuSection />
        // },
        // processRoute(route) {
        //     //..
        // }
    }
}

window.__DRAFTERBIT__.addModule(createSwaggerClientModule(window.__DRAFTERBIT__))