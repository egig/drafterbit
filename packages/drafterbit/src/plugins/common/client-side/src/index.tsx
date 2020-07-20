import React, { lazy}  from 'react';
import stateReducer from './stateReducer';
import Module from "../../../admin/client-side/src/Module";

const Settings = lazy(() => import('./components/Settings'));

import {
    SettingOutlined,
} from '@ant-design/icons';


class CommonModule extends Module {
    name: string = "common";
    stateReducer: Module.StateReducer = stateReducer;
    admin: Module.AdminConfig = {
        routes: [
            {path: "/settings", component: Settings},
        ],
    };

    async getMenu(): Promise<Module.Menu[]> {
        return [
            {
                link: "/settings",
                label: "Settings",
                icon: <SettingOutlined />
            }
        ]
    };

    registerApiClient(): any {
        return {
            getSettings: async function () {
                return this._doGetRequest("/settings");
            },
            setSettings: async function (payload: any) {
                return this.axiosInstance.patch("/settings", payload);
            }
        }
    };

    stateFilter(state: any) {
        return this.$dt.getApiClient().getSettings()
            .then((settings: any) => {
                settings.map((s: any) => {
                    state.COMMON.settings[s["fieldset_name"]] = s;
                })
            })
    };
}

(($dt) => {

    $dt.addModule(new CommonModule($dt));

})(window.$dt);