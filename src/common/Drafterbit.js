import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import SubRoutes from './SubRoutes';
import adminRoutes from './modules/admin/routes';
import Home from './modules/common/components/Home';
import ReactRouteManager from '../ReactRouteManager';

let routeManager = new ReactRouteManager();
routeManager.addRoutes(adminRoutes);

class Drafterbit extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let state = this.props.store.getState();

        return (
            <Provider store={this.props.store}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    {routeManager.getRoutes().map((route, i) => (
                        <SubRoutes key={i} {...route}/>
                    ))}
                </Switch>
            </Provider>
        );

    }
}

module.exports = Drafterbit;