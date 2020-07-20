import React, { lazy } from 'react';
import stateReducer from './stateReducer';
import ApiClient from './ApiClient';
import Module2 from "../../../admin/client-side/src/Module2";

const ContentEdit = lazy(() => import('./components/ContentEdit'));
const Contents = lazy(() => import('./components/Contents'));
const Types = lazy(() => import('./components/Types'));
const Type = lazy(() => import('./components/Type'));

import {
    BuildOutlined,
    FileTextOutlined
} from '@ant-design/icons';

class ContentModule extends Module2 {
    name: string =  "content";
    stateReducer: Module2.StateReducer = stateReducer;
    admin: Module2.AdminConfig = {
        routes: [
            {path: "/c/:type_name/:content_id", component: ContentEdit},
            {path: "/c/:type_name", component: Contents},
            {path: "/types/:type_name", component: Type},
            {path: "/types", component: Types},
        ]
    };

    registerApiClient() {
        return ApiClient
    };

    async getMenu(): Promise<any[]> {
        let client = this.$dt.getApiClient();
        return client.getTypes({fq:"has_fields:true"})
            .then((types: any) => {

                let menus = types.map((ct: any) => {
                    return {
                        link: `/c/${ct.name}`,
                        label: ct.name,
                    }
                });

                return [
                    {
                        icon: <FileTextOutlined />,
                        label: "Collections",
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
}

(($dt) => {
    $dt.addModule2(new ContentModule($dt))
})(window.$dt);