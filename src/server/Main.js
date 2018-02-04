import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import Drafterbit from '../common/Drafterbit';
import Html from './Html';
import storeFromState from '../common/storeFromState';
import createJSSInstance from '../createJSSInstance';

const Main = function Main(url = '/', sheets, state) {

    const store = storeFromState(state);
    const context = {};
    let data = {
        __PRELOADED_STATE: state
    };

    const jss = createJSSInstance();
    const drafterbit = {}; // TODO;

    data.children = ReactDOMServer.renderToString(
        <StaticRouter location={url} context={context}>
            <Drafterbit store={store} jss={jss} drafterbit={drafterbit}/>
        </StaticRouter>
    );

    return ReactDOMServer.renderToStaticMarkup(<Html {...data} />);

};


export default Main;
