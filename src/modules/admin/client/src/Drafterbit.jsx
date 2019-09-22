import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import PropTypes from 'prop-types';
import ProtectedRoute from './ProtectedRoute';
import { Route } from 'react-router-dom';
import Dashboard from './modules/common/components/Dashboard';
import Layout from './modules/common/components/Layout';

class Drafterbit extends React.Component {

    render() {
        return (
            <Route render={({ location }) => (
                <Provider store={this.props.store}>
                    <Switch location={location}>
                        {/* <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/register-success" component={RegisterSuccess} />
                        <Route path="/forgot-password" component={ForgotPassword} />
                        <Route path="/forgot-password-requested" component={ForgotPasswordRequested} />
                        <Route path="/reset-password" component={ResetPassword} />
                        <ProtectedRoute path="/users" component={Users} /> */}
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