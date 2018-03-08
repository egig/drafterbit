import React from 'react';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import PropTypes from 'prop-types';
import ProtectedRoute from './ProtectedRoute';
import { Route } from 'react-router-dom';
import Login from './modules/user/components/Login';
import Register from './modules/user/components/Register';
import RegisterSuccess from './modules/user/components/RegisterSuccess';
import ForgotPassword from './modules/user/components/ForgotPassword';
import ForgotPasswordRequested from './modules/user/components/ForgotPasswordRequested';
import Dashboard from './modules/common/components/Dashboard';
import NewProject from './modules/project/components/NewProject';
import ProjectDashboard from './modules/project/components/ProjectDashboard';
import ContentTypes from './modules/project/components/ContentTypes';
import ContentType from './modules/project/components/ContentType';
import Contents from './modules/content/components/Contents';
import ApiKeys from './modules/setting/components/ApiKeys';
import ProjectSetting from './modules/setting/components/ProjectSetting';

class Drafterbit extends React.Component {
    render() {
        return (
            <Provider store={this.props.store}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/register-success" component={RegisterSuccess} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/forgot-password-requested" component={ForgotPasswordRequested} />
	            <ProtectedRoute path="/project/:project_id/contents/:slug" component={Contents} />
	            <ProtectedRoute path="/project/:project_id/content_types/:content_type_id" component={ContentType} />
	            <ProtectedRoute path="/project/:project_id/content_types" component={ContentTypes} />
	            <ProtectedRoute path="/project/:project_id/api_keys" component={ApiKeys} />
	            <ProtectedRoute path="/project/:project_id/settings" component={ProjectSetting} />
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