import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

class Home extends React.Component {
    render() {
        return(<h1>Home</h1>);
    }
}

const Drafterbit = function (props) {

    let state = props.store.getState();

    return (
        <Provider store={props.store}>
            <Switch>
                <Route path="/" exact component={Home} />
            </Switch>
        </Provider>
    );
};

module.exports = Drafterbit;