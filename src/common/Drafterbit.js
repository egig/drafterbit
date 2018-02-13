import React from 'react';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import PropTypes from 'prop-types';
import ProtectedRoute from './ProtectedRoute';
import { Route } from 'react-router-dom';
import Login from '../common/modules/user/components/Login';
import Dashboard from '../common/modules/common/components/Dashboard';

class Drafterbit extends React.Component {
    render() {
        return (
            <Provider store={this.props.store}>
            <Switch>
              <Route path="/login" component={Login} />
              <ProtectedRoute path="/" component={Dashboard} />
            </Switch>
            </Provider>
        );

    }

		getChildContext() {
			return {
				drafterbit: this.props.drafterbit,
				jss: this.props.jss,
			};
		}
}

Drafterbit.childContextTypes = {
	drafterbit: PropTypes.object.isRequired,
	jss: PropTypes.object.isRequired
};

module.exports = Drafterbit;