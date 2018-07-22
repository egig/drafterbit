import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const ProtectedRoute = (route) => (
    <Route path={route.path} exact={true} render={props => {
	    return (
		    (!!route.currentUser && route.currentUser.token) ? <route.component {...props} routes={route.routes}/> :
			    <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
	    );
    }}/>
);

export default connect(

    state => ({
        currentUser: state.user.currentUser
    }))(ProtectedRoute);