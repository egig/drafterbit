import React, { lazy } from 'react';
import stateReducer from './stateReducer';
import { getCookie } from 'drafterbit-module-admin/client/src/cookie';
import NavBarMenu from './components/NavBarMenu';

const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const Users = lazy(() => import('./components/Users'));
const RegisterSuccess = lazy(() => import('./components/RegisterSuccess'));

function createUserClientModule() {

    return {
        name: "user",
        stateReducer: stateReducer,
        pageRoutes: [
            {path: "/login", component: Login},               
            {path: "/register", component: Register},
            {path: "/reset-password", component: ResetPassword},               
            {path: "/forgot-password", component: ForgotPassword},
            {path: "/register-success", component: RegisterSuccess}
        ],
        routes: [
            {path: "/users", component: Users},
        ],
        generalMenus: [
            {link: "/users", label: "Users", iconClass: "icon-user"}
        ],
        processRoute(route, location, state) {

            if(location.pathname === "/login") {
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
        },
        preRenderAction(state) {
            let t = getCookie('dt_auth_token');
            if (!!t) {
                // TODO get logged in user detail here
                // And set to redux user
                state.USER.token = t;
            }
        },
        renderNavBarMenu(i) {
            return <NavBarMenu key={i} />
        }
    }
}

window.__DRAFTERBIT__.addModule(createUserClientModule(window.__DRAFTERBIT__));