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
        generalMenus: [
            {link: "/requests", label: "Requests", iconClass: "icon-target", icon: <ApiOutlined/>}
        ]
    })
})(window.$dt)