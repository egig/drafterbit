import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import withDrafterbit from './withDrafterbit';

const ProtectedRoute = (route) => {
    return <Route path={route.path} exact={true} render={props => {

        for (let i=0; i<route.drafterbit.modules.length;i++) {
            let mo = route.drafterbit.modules[i];
            if(typeof mo.processRoute !== "function") {
                continue;
            }
    
            route = mo.processRoute(route);
        }
    
        if(!!route.redirect) {
            return <Redirect to={redirect}/>
        }

    }}/>
};

export default connect(

    state => ({
        token: state.USER.token
    }))(withDrafterbit(ProtectedRoute));