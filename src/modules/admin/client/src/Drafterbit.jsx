import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Dashboard from './modules/common/components/Dashboard';
import Layout from './modules/common/components/Layout';
import { HashRouter, Redirect } from 'react-router-dom';

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
                                            <Switch location={location}>
                                                {this.props.drafterbit.modules.map(m => {
                                                    return m.routes.map(route => {

                                                        for (let i=0; i<this.props.drafterbit.modules.length;i++) {
                                                            let mo = this.props.drafterbit.modules[i];
                                                            if(typeof mo.processRoute !== "function") {
                                                                continue;
                                                            }

                                                            let old = route;
                                                            route = mo.processRoute(route, location, this.props.store.getState());
                                                            if(!route) {
                                                                route = old;
                                                            }
                                                        }

                                                        if(!!route.redirect) {
                                                            return <Redirect to={route.redirect}/>
                                                        }

                                                        return <Route key={route.path} exact={true} path={route.path} component={route.component} />
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