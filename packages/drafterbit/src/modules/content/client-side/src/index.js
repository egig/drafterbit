import React, { lazy } from 'react';
import stateReducer from './stateReducer';
import ApiClient from './ApiClient';

const ContentEdit = lazy(() => import('./components/ContentEdit'));
const Contents = lazy(() => import('./components/Contents'));
const Types = lazy(() => import('./components/Types'));
const ContentType = lazy(() => import('./components/ContentType'));

import {
    BuildOutlined,
    FileTextOutlined
} from '@ant-design/icons';

(($dt) => {
    $dt.addModule({
        name: "content",
        stateReducer: stateReducer,
        routes: [
            {path: "/contents/:content_type_slug/:content_id", component: ContentEdit},
            {path: "/contents/:content_type_slug", component: Contents},
            {path: "/content_types/:content_type_id", component: ContentType},
            {path: "/types", component: Types},
        ],
        generalMenus: [
            {link: "/types", label: "Types", icon: <BuildOutlined/>}
        ],
        registerApiClient() {
            return ApiClient
        },
        async getMenu() {
            let client = $dt.getApiClient();
            return client.getTypes()
                .then((contentTypes) => {
                    let menus = contentTypes.map(ct => {
                        return {
                            link: `/contents/${ct.name}`,
                            label: ct.name,
                        }
                    });

                    return [
                        {
                            icon: <FileTextOutlined />,
                            label: "Contents",
                            children: menus
                        }
                    ]

                });
        }
    })
})(window.$dt);