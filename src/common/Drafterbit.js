import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
//import PageModule from './modules/page/PageModule';
import SubRoutes from './SubRoutes';
import reactRoutes from './modules/page/reactRoutes';

class Home extends React.Component {
    render() {
        return(<h1>Home</h1>);
    }
}

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
                    {reactRoutes.map((route, i) => (
                        <SubRoutes key={i} {...route}/>
                    ))}
                </Switch>
            </Provider>
        );

    }
}

module.exports = Drafterbit;