import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const Request = lazy(() => import('./components/Request'));
import {
    ApiOutlined,
} from '@ant-design/icons'

(($dt) => {
    $dt.addModule({
        name: "swagger",
        routes: [
            {path: "/requests", component: Request}
        ],
        getMenu() {
            return [
                {
                    link: "/requests",
                    label: "Requests",
                    icon: <ApiOutlined/>,
                    order: 4
                }
            ]
        }
    })
})(window.$dt)