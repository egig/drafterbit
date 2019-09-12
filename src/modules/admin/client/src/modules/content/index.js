import React, { lazy } from 'react';
const ContentEdit = lazy(() => import('./components/ContentEdit'));
const Contents = lazy(() => import('./components/Contents'));

export default function(drafterbit) {

    return {
        name: "content",
        routes: [
            {path: "/contents/:content_type_slug/:content_id", component: ContentEdit},
            {path: "/contents/:content_type_slug", component: Contents},
        ],
        generalMenus: [
            // {link: "/content_types", label: "Content Types", iconClass: "icon-puzzle"}
        ],
        getMenuSection() {
            let contentTypes =  drafterbit.store.getState().CONTENT_TYPE.contentTypes;            
            return {
                label: "Content",
                iconClass: "icon-docs",
                menuItems: contentTypes.map(ct => {
                    return {
                        link: `/contents/${ct.slug}`,
                        label: ct.name,
                        iconClass: "icon-doc"
                    }
                })
            }
        }
    }
}