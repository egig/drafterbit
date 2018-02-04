import React from 'react';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import SubRoutes from './SubRoutes';
import contentRoutes from './modules/content/routes';
import commonRoutes from './modules/user/routes';
import projectRoutes from './modules/project/routes';
import ReactRouteManager from '../ReactRouteManager';
import PropTypes from 'prop-types';

let routeManager = new ReactRouteManager();
routeManager.addRoutes(projectRoutes);
routeManager.addRoutes(contentRoutes);
routeManager.addRoutes(commonRoutes);

class Drafterbit extends React.Component {
    render() {
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