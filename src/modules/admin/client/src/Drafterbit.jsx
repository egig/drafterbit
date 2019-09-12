import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import PropTypes from 'prop-types';
import ProtectedRoute from './ProtectedRoute';
import { Route } from 'react-router-dom';
import Login from './modules/user/components/Login';
import Register from './modules/user/components/Register';
import RegisterSuccess from './modules/user/components/RegisterSuccess';
import ForgotPassword from './modules/user/components/ForgotPassword';
import ResetPassword from './modules/user/components/ResetPassword';
import ForgotPasswordRequested from './modules/user/components/ForgotPasswordRequested';
import Dashboard from './modules/common/components/Dashboard';
import ApiKeys from './modules/api_key/components/ApiKeys';
import ApiKeyNew from './modules/api_key/components/ApiKeyNew';
import ApiKeyEdit from './modules/api_key/components/ApiKeyEdit';
import Users from './modules/user/components/Users';
import Layout from './modules/common/components/Layout';
import Request from './modules/common/components/Request'

class Drafterbit extends React.Component {

    render() {
        return (
            <Route render={({ location }) => (
                <Provider store={this.props.store}>
                    <Switch location={location}>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/register-success" component={RegisterSuccess} />
                        <Route path="/forgot-password" component={ForgotPassword} />
                        <Route path="/forgot-password-requested" component={ForgotPasswordRequested} />
                        <Route path="/reset-password" component={ResetPassword} />
                        <ProtectedRoute path="/users" component={Users} />
                        <Route path="/">
                            <Layout>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Switch>
                                        {this.props.drafterbit.modules.map(m => {
                                            return m.routes.map(r => {
                                                return <ProtectedRoute path={r.path} component={r.component} />
                                            })
                                        })};
                                    </Switch>
                                </Suspense>
                            </Layout>
                        </Route>
                    </Switch>
                </Provider>
            )} />
        );

    }

    getChildContext() {
        return {
            drafterbit: this.props.drafterbit,
            languageContext: this.props.languageContext
        };
    }
}

Drafterbit.childContextTypes = {
    drafterbit: PropTypes.object.isRequired,
    languageContext: PropTypes.object.isRequired
};

export default Drafterbit;