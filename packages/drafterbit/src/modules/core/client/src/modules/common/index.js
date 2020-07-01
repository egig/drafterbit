import React  from 'react';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import MenuSection from './components/MenuSection';
import stateReducer from './stateReducer';

import {
    SettingOutlined,
} from '@ant-design/icons';

function createCommonModule(drafterbit) {

    return {
        name: "common",
        stateReducer: stateReducer,
        routes: [
            {path: "/", component: Dashboard},
            {path: "/settings", component: Settings},
        ],
        generalMenus: [
            {link: "/settings", label: "Settings", iconClass: "icon-settings", icon: <SettingOutlined />}
        ],
        renderMenuSection(i) {
            return <MenuSection key={i} />
        },
        processRoute(route) {
            //..
        },

        registerApiClient() {
            return {
                getSettings: async function () {
                    return this._doGetRequest("/settings");
                }
            }
        }
    }
}

window.__DRAFTERBIT__.addModule(createCommonModule(window.__DRAFTERBIT__));