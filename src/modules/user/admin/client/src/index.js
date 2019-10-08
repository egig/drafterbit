import React, { lazy } from 'react';
import reducer from './reducer';
import { Redirect } from 'react-router-dom';

const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const Users = lazy(() => import('./components/Users'));

function createUserClientModule(drafterbit) {

    return {
        name: "user",
        stateName: "USER",
        defaultState: {
            currentUser: null,
        },
        reducer: reducer,
        pageRoutes: [
            {path: "/login", component: Login},               
            {path: "/register", component: Register},               
            {path: "/reset-password", component: ResetPassword},               
            {path: "/forgot-password", component: ForgotPassword}
        ],
        routes: [
            {path: "/users", component: Users},
        ],
        generalMenus: [
            {link: "/users", label: "Users", iconClass: "icon-user"}
        ],
        processRoute(route, location, state) {

            if(location.pathname == "/login") {
                return route;
            }

            if(!state.USER.token) {
                route.redirect = {
                    pathname: '/login',
                    state: {
                        referrer: route.location
                    }
                }
            }

            return route;
        }
    }
}

window.__DRAFTERBIT__.addModule(createUserClientModule(window.__DRAFTERBIT__))