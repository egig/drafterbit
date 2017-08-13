import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import Login from './modules/user/components/Login';
import ForgetPassword from './modules/user/components/ForgetPassword';

const Drafterbit = function (props) {

	let state = props.store.getState();

	return (
		<Provider store={props.store}>
				<Switch>
					<Route path="/user/login" exact component={Login} />
					<Route path="/user/forget_password" component={ForgetPassword} />
				</Switch>
		</Provider>
	);
};

module.exports = Drafterbit;