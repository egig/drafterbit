import React, { lazy } from 'react';
import stateReducer from './stateReducer';
import ApiClient from './ApiClient';
import MenuSection from './components/MenuSection';
import { Redirect } from 'react-router-dom';

const ContentEdit = lazy(() => import('./components/ContentEdit'));
const Contents = lazy(() => import('./components/Contents'));
const Types = lazy(() => import('./components/Types'));
const ContentType = lazy(() => import('./components/ContentType'));

import {
    BuildOutlined,
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
        renderMenuSection(i) {
            return <MenuSection key={i} />
        },
        registerApiClient() {
            return ApiClient
        }
    })
})(window.$dt);