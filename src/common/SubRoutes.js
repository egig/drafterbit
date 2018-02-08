import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const SubRoutes = (route) => (
    <Route path={route.path} exact={true} render={props => {
	    if(!route.isPublic) {
	    	return (
			    (!!route.currentUser && route.currentUser.name) ? <route.component {...props} routes={route.routes}/> :
				    <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
		    )
	    }

	    return <route.component {...props} routes={route.routes}/>;
    }}/>
);

export default connect(

	state => ({
		currentUser: state.user.currentUser
	}))(SubRoutes);