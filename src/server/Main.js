import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import Drafterbit from '../common/Drafterbit';
import Html from './Html';
import storeFromState from '../common/storeFromState';
import createJSSInstance from '../createJSSInstance';
import { Helmet } from 'react-helmet';
import i18next from 'i18next';
import config from '../config';
import apiClient from '../apiClient';

const Main = function Main(url = '/', sheets, state) {

    const i18n = i18next.createInstance();

    const store = storeFromState(state);
    const context = {};
    let data = {
        __PRELOADED_STATE__: state
    };

    const jss = createJSSInstance();
    const drafterbit = {
    	apiClient: apiClient.createClient({
    		baseURL: config.get('API_BASE_URL')
	    })
    };

    let languageContext = {
        namespaces: [],
        i18n: i18n
    };

    const  Component = (
        <StaticRouter location={url} context={context}>
            <Drafterbit store={store}
				            jss={jss}
				            drafterbit={drafterbit}
				            languageContext={languageContext} />
        </StaticRouter>
    );
    // Scan context
    ReactDOMServer.renderToString(Component);

    let language = state.common.language;
    let namespaces = languageContext.namespaces;
    let languageResources = {};

    namespaces.map(ns => {
        let languageObject = require(`../../locales/${language}/${ns}.json`);
        if(typeof languageResources[language] === 'undefined') {
            languageResources[language] = {};
        }

        languageResources[language][ns] = languageObject;
    });

    data.head = Helmet.renderStatic();
    data.__PRELOADED_LANGUAGE_RESOURCES__ = languageResources;
    data.__DRAFTERBIT_CONFIG__ = {
        apiBaseURL: config.get('API_BASE_URL')
    };

    i18n.init({
        debug: false, // TODO make this one file for all project
        lng: state.common.language,
        resources: languageResources
    });

    languageContext.i18n = i18n;

    const NewComponent = (
        <StaticRouter location={url} context={context}>
            <Drafterbit store={store}
				            jss={jss}
				            drafterbit={drafterbit}
				            languageContext={languageContext} />
        </StaticRouter>
    );

    data.children = ReactDOMServer.renderToString(NewComponent);

    let html = ReactDOMServer.renderToStaticMarkup(<Html {...data} />);

    return {
    	context,
	    html,
	    languageContext
    };
};


export default Main;
