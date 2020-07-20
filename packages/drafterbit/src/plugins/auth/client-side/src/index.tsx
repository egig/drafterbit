import React, { lazy } from 'react';
import stateReducer from './stateReducer';
// @ts-ignore
import { getCookie } from '@drafterbit/common/client-side/cookie';
import NavBarMenu from './components/NavBarMenu';
import ApiClient from './ApiClient';
import { Redirect } from 'react-router-dom';
import Module2 from "../../../admin/client-side/src/Module2";

const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const RegisterSuccess = lazy(() => import('./components/RegisterSuccess'));

import {
    UserOutlined,
} from '@ant-design/icons'

class AuthModule extends Module2 {
    name: string = "user";
    stateReducer: Module2.StateReducer = stateReducer;
    routes:Object[] =  [
        {path: "/login", component: Login},
        {path: "/register", component: Register},
        {path: "/reset-password", component: ResetPassword},
        {path: "/forgot-password", component: ForgotPassword},
        {path: "/register-success", component: RegisterSuccess}
    ];


    routeFilter(route: any, location: any, state: any) {

        if(location.pathname === "/login") {
            return route;
        }

        if(!state['USER'].token) {
            return {
                component:  () => <Redirect to={{
                pathname: '/login',
                    state: {
                    referrer: route.location
                }
            }}/>
        }
        }

        return route;
    };


    stateFilter(state: any) {
        let t = getCookie('dt_auth_token');
        if (!!t) {
            // TODO get logged in user detail here
            // Send token to server to get user detail
            // And set to redux user
            state.USER.token = t;
        }
    };


    renderNavBarMenu() {
        return <NavBarMenu />
    };

    registerApiClient() {
        return ApiClient
    }
}

(($dt) =>{
    $dt.addModule2(new AuthModule($dt))
})(window.$dt);