import React, { lazy}  from 'react';
// import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import stateReducer from './stateReducer';

const Dashboard = lazy(() => import('./components/Dashboard'));

import {
    SettingOutlined,
} from '@ant-design/icons';

(($dt) => {

    $dt.addModule({
        name: "common",
        stateReducer: stateReducer,
        routes: [
            {path: "/settings", component: Settings},
            {path: "/", component: Dashboard},
        ],
        getMenu() {
            return [
                {
                    link: "/settings",
                    label: "Settings",
                    icon: <SettingOutlined />
                }
            ]
        },

        registerApiClient() {
            return {
                getSettings: async function () {
                    return this._doGetRequest("/settings");
                },
                setSettings: async function (payload) {
                    return this.axiosInstance.patch("/settings", payload);
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