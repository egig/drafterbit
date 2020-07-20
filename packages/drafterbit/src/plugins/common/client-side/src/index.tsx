import React, { lazy}  from 'react';
import stateReducer from './stateReducer';
import Module2 from "../../../admin/client-side/src/Module2";

const Settings = lazy(() => import('./components/Settings'));

import {
    SettingOutlined,
} from '@ant-design/icons';


class CommonModule extends Module2 {
    name: string = "common";
    stateReducer: Module2.StateReducer = stateReducer;
    admin: Module2.AdminConfig = {
        routes: [
            {path: "/settings", component: Settings},
        ],
    };

    getMenu(): any[] {
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

    $dt.addModule2(new CommonModule($dt));

})(window.$dt);