import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch, HashRouter, Redirect  } from 'react-router-dom';
import Layout from './Layout';
import DTContext  from '@drafterbit/common/client-side/DTContext';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const LoadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class Shell extends React.Component {

    render() {
        let store = this.props.$dt.store;
        return (
            <Provider store={store}>
                <DTContext.Provider value={this.props.$dt}>
                <HashRouter>
                    <Suspense fallback={<Spin indicator={LoadingIcon} />}>
                        <Route path="/" render={({ location }) => {

                            let pagePattern = this.props.$dt.modules.map(m => {
                                return m.routes.map(r => {
                                    return r.path.substr(1)
                                }).join("|")
                            }).filter(i => !!i).join("|");

                            let matchPagePath = function() {
                                if (pagePattern === "") {
                                    return true;
                                }

                                let r = new RegExp(`^\/(?!(?:${pagePattern})\/?$).*$`);
                                return r.test(location.pathname);
                            };

                            if(matchPagePath()) {
                                return (
                                    <Layout $dt={this.props.$dt}>
                                        <Suspense fallback={<Spin indicator={LoadingIcon} />}>
                                            <Switch location={location}>
                                                {this.props.$dt.modules.map(m => {
                                                    return m.admin.routes.map(route => {

                                                        for (let i=0; i<this.props.$dt.modules.length;i++) {
                                                            let mo = this.props.$dt.modules[i];

                                                            let old = route;
                                                            route = mo.routeFilter(route, location, store.getState());
                                                            if(!route) {
                                                                route = old;
                                                            }
                                                        }

                                                        return <Route exact {...route} />
                                 w                   })
                                                })}
                                            </Switch>
                                        </Suspense>
                                    </Layout>
                                )
                            }

                            return this.props.$dt.modules.map(m => {
                                return m.routes.map(r => {
                                    return <Route key={r.path} exact {...r} />
                                })
                            });

                        }} />
                    </Suspense>
                </HashRouter>
                </DTContext.Provider>
            </Provider>
        );

    }

    getChildContext() {
        return {
            $dt: this.props.$dt,
            languageContext: this.props.$dt.languageContext
        };
    }
}

Shell.childContextTypes = {
    $dt: PropTypes.object.isRequired,
    languageContext: PropTypes.object.isRequired
};

export default Shell;