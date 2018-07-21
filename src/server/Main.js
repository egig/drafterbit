import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import Drafterbit from '../common/Drafterbit';
import Html from './Html';
import storeFromState from '../common/storeFromState';
import createJSSInstance from '../createJSSInstance';
import createI18nextInstance from '../createI18nextInstance';
import { Helmet } from 'react-helmet';

const Main = function Main(url = '/', sheets, state) {

		const i18n = createI18nextInstance(false, state.common.language, state.common.languages );

    const store = storeFromState(state);
    const context = {};
    let data = {
        __PRELOADED_STATE__: state
    };

    const jss = createJSSInstance();
    const drafterbit = {}; // TODO;

		let languageContext = {
			namespaces: [],
			i18n: i18n
		} ;

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

		let language = languageContext.i18n.options.lng;
		let namespaces = languageContext.namespaces;
		let languageResources = {};

		namespaces.map(ns => {
			let languageObject = require(`../../locales/${language}/${ns}.json`);
			languageContext.i18n.addResourceBundle(language, ns, languageObject);
			if(typeof languageResources[language] === 'undefined') {
				languageResources[language] = {};
			}

			languageResources[language][ns] = languageObject;
		});

		data.head = Helmet.renderStatic();
		data.__PRELOADED_LANGUAGE_RESOURCES__ = languageResources;

		data.children = ReactDOMServer.renderToString(Component);

	let html = ReactDOMServer.renderToStaticMarkup(<Html {...data} />);

    return {
    	context,
	    html,
	    languageContext
    }
};


export default Main;
