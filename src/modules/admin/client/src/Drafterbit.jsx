import React, { Suspense, lazy, Fragment } from 'react';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import PropTypes from 'prop-types';
import ProtectedRoute from './ProtectedRoute';
import { Route } from 'react-router-dom';
import Dashboard from './modules/common/components/Dashboard';
import Layout from './modules/common/components/Layout';
import { HashRouter } from 'react-router-dom';

class Drafterbit extends React.Component {

    render() {
        return (
            <Provider store={this.props.store}>            
                <HashRouter>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Route path="/" render={({ location }) => {

                            let pagePattern = this.props.drafterbit.modules.map(m => {
                                if(!!m.pageRoutes && !!m.pageRoutes.length) {
                                    return m.pageRoutes.map(r => {
                                        return r.path.substr(1)
                                    }).join("|")
                                }
                            }).filter(i => !!i).join("|");

                            let r = new RegExp(`^\/(?!(?:${pagePattern})\/?$).*$`);
                            if(r.test(location.pathname)) {
                                return (
                                    <Layout>
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <Switch>
                                                {this.props.drafterbit.modules.map(m => {
                                                    return m.routes.map(r => {
                                                        return <ProtectedRoute key={r.path} path={r.path} component={r.component} />
                                                    })
                                                })}
                                            </Switch>
                                        </Suspense>
                                    </Layout>
                                )
                            }
                            return this.props.drafterbit.modules.map(m => {
                                if(!!m.pageRoutes && !!m.pageRoutes.length) {
                                    return m.pageRoutes.map(r => {
                                        return <Route key={r.path} exact={true} path={r.path} component={r.component} />
                                    })
                                }
                            });

                        }} />                          
                    </Suspense>
                </HashRouter>                    
            </Provider>
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