import React, { lazy}  from 'react';

const Dashboard = lazy(() => import('./components/Dashboard'));

import {
    MonitorOutlined,
} from '@ant-design/icons';

(($dt) => {

    $dt.addModule({
        name: "common",
        routes: [
            {path: "/", component: Dashboard},
        ],
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
    });

})(window.$dt);