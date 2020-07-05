import React, { lazy } from 'react';
import stateReducer from './stateReducer';
import ApiClient from './ApiClient';

const ContentEdit = lazy(() => import('./components/ContentEdit'));
const Contents = lazy(() => import('./components/Contents'));
const Types = lazy(() => import('./components/Types'));
const Type = lazy(() => import('./components/Type'));

import {
    BuildOutlined,
    FileTextOutlined
} from '@ant-design/icons';

(($dt) => {
    $dt.addModule({
        name: "content",
        stateReducer: stateReducer,
        routes: [
            {path: "/contents/:type_name/:content_id", component: ContentEdit},
            {path: "/contents/:type_name", component: Contents},
            {path: "/types/:type_id", component: Type},
            {path: "/types", component: Types},
        ],
        registerApiClient() {
            return ApiClient
        },
        async getMenu() {
            let client = $dt.getApiClient();
            return client.getTypes()
                .then((types) => {
                    let menus = types.map(ct => {
                        return {
                            link: `/contents/${ct.name}`,
                            label: ct.name,
                        }
                    });

                    return [
                        {
                            icon: <FileTextOutlined />,
                            label: "Contents",
                            children: menus,
                            order: 2
                        },
                        {
                            link: "/types",
                            label: "Types",
                            icon: <BuildOutlined/>,
                            order: 9
                        }
                    ]

                });
        }
    })
})(window.$dt);