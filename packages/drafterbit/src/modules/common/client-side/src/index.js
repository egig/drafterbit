import React  from 'react';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import MenuSection from './components/MenuSection';
import stateReducer from './stateReducer';

import {
    SettingOutlined,
} from '@ant-design/icons';
import {getCookie} from '@drafterbit/common/client-side/cookie';

(($dt) => {

    $dt.addModule({
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
        },
        stateFilter(state) {
            return $dt.getApiClient().getSettings()
                .then(settings => {
                    settings.map(s => {
                        state.COMMON.settings[s["fieldset_name"]] = s;
                    })
                })
        },
    });

})(window.$dt);