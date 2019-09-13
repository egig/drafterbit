import React, { lazy } from 'react';
import reducer from './reducer';

const ContentEdit = lazy(() => import('./components/ContentEdit'));
const Contents = lazy(() => import('./components/Contents'));
const ContentTypes = lazy(() => import('./components/ContentTypes'));
const ContentType = lazy(() => import('./components/ContentType'));

export default function(drafterbit) {

    drafterbit.on('sidenavdidmount', () => {
        
    })

    return {
        name: "content",
        stateName: "CONTENT",
        defaultState: {
            content: {
                fields: []
            },
            contents: [],
            ctFields: {fields: []}
        },
        reducer: reducer,
        routes: [
            {path: "/contents/:content_type_slug/:content_id", component: ContentEdit},
            {path: "/contents/:content_type_slug", component: Contents},
            {path: "/content_types/:content_type_id", component: ContentType},                
            {path: "/content_types", component: ContentTypes},
        ],
        generalMenus: [
            {link: "/content_types", label: "Content Types", iconClass: "icon-puzzle"}
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