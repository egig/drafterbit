import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import withDrafterbit from './withDrafterbit';

const ProtectedRoute = (route) => (
    <Route path={route.path} exact={true} render={props => {

        let returnComponent;

        // TODO break the loop once compoenent returned
        route.drafterbit.modules.map((mo) => {
            if(typeof mo.processRoute == "function") {
                returnComponent = mo.processRoute(route);
            }
        });

        if(!!returnComponent) return returnComponent;

        return  <route.component {...props} routes={route.routes}/>
    }}/>
);

export default connect(

    state => ({
        currentUser: state.USER.currentUser
    }))(withDrafterbit(ProtectedRoute));