import React  from 'react';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import stateReducer from './stateReducer';

import {
    SettingOutlined,
} from '@ant-design/icons';

(($dt) => {

    $dt.addModule({
        name: "common",
        stateReducer: stateReducer,
        routes: [
            {path: "/", component: Dashboard},
            {path: "/settings", component: Settings},
        ],
        getMenu() {
            return [
                {
                    link: "/settings",
                    label: "Settings",
                    icon: <SettingOutlined />}
            ]
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