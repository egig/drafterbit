import React from 'react';
import PropTypes from 'prop-types';
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

ProtectedRoute.propTypes = {
    location: PropTypes.string.isRequired
};

export default connect(

    state => ({
        currentUser: state.USER.currentUser
    }))(ProtectedRoute);