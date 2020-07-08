import React, { lazy } from 'react';
import ApiClient from './ApiClient';

const Files = lazy(() => import('./components/Files'));

import {
    FolderOutlined,
} from '@ant-design/icons';

(($dt) => {
    $dt.addModule({
        name: "file",
        stateName: "FILES",
        defaultState: {
        },
        routes: [
            {path: "/files", component: Files},
        ],
        getMenu() {
            return [
                {
                    link: "/files",
                    label: "Files",
                    icon: <FolderOutlined/>,
                    order: 3,
                }
            ]
        },
        registerApiClient() {
            return ApiClient;
        }
    })
})(window.$dt);