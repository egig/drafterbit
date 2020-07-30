import React, { lazy}  from 'react';
import Module from "drafterbit/dist/plugins/admin/client-side/src/Module";

const Dashboard = lazy(() => import('./components/Dashboard'));

import {
    MonitorOutlined,
} from '@ant-design/icons';


class MyModule extends Module {
    name = "mymodule";

    admin =  {
        routes: [
            {path: "/", component: Dashboard},
        ]
    };

    async getMenu() {
        return [
            {
                link: "/",
                label: "Dashboard",
                icon: <MonitorOutlined />,
                order: 0
            }
        ]
    }
}

(($dt) => {
    $dt.addModule(new MyModule($dt));
})(window.$dt);