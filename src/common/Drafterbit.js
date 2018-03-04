import React from 'react';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import PropTypes from 'prop-types';
import ProtectedRoute from './ProtectedRoute';
import { Route } from 'react-router-dom';
import Login from './modules/user/components/Login';
import Dashboard from './modules/common/components/Dashboard';
import NewProject from './modules/project/components/NewProject';
import ProjectDashboard from './modules/project/components/ProjectDashboard';
import ContentTypes from './modules/project/components/ContentTypes';

class Drafterbit extends React.Component {
    render() {
        return (
            <Provider store={this.props.store}>
            <Switch>
              <Route path="/login" component={Login} />
	            <ProtectedRoute path="/project/:project_id/content_types" component={ContentTypes} />
	            <ProtectedRoute path="/project/new" component={NewProject} />
	            <ProtectedRoute path="/project/:project_id" component={ProjectDashboard} />
	            <ProtectedRoute path="/" component={Dashboard} />
            </Switch>
            </Provider>
        );

    }

		getChildContext() {
			return {
				drafterbit: this.props.drafterbit,
				jss: this.props.jss,
				languageContext: this.props.languageContext
			};
		}
}

Drafterbit.childContextTypes = {
	drafterbit: PropTypes.object.isRequired,
	jss: PropTypes.object.isRequired,
	languageContext: PropTypes.object.isRequired
};

module.exports = Drafterbit;