import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import SubRoutes from './SubRoutes';
import commonRoutes from './modules/common/routes';
import ReactRouteManager from '../ReactRouteManager';

let routeManager = new ReactRouteManager();
routeManager.addRoutes(commonRoutes);

class Drafterbit extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let state = this.props.store.getState();

        return (
            <Provider store={this.props.store}>
                <Switch>
                    {routeManager.getRoutes().map((route, i) => (
                        <SubRoutes key={i} {...route}/>
                    ))}
                </Switch>
            </Provider>
        );

    }
}

module.exports = Drafterbit;