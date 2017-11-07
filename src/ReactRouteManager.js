import React from 'react';

class ReactRouteManager extends React.Component {
	constructor(props) {
		super(props);
		this._routes = [];
	}

	addRoutes(routes) {
		this._routes = this._routes.concat(routes);
	}

	getRoutes(){
		return this._routes;
	}
}

export default ReactRouteManager;