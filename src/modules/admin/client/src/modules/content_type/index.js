import React, { lazy } from 'react';

const ContentTypes = lazy(() => import('./components/ContentTypes'));
const ContentType = lazy(() => import('./components/ContentType'));

export default function(drafterbit) {
    return {
        name: "content_types",
        routes: [
            {path: "/content_types/:content_type_id", component: ContentType},                
            {path: "/content_types", component: ContentTypes},
        ],
        generalMenus: [
            {link: "/content_types", label: "Content Types", iconClass: "icon-puzzle"}
        ]
    }
}