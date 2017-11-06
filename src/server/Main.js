import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import Drafterbit from '../common/Drafterbit';
import Html from './Html';
const {SheetsRegistryProvider} =  require('react-jss');
import storeFromState from '../common/storeFromState';

const Main = function Main(url = '/', sheets, state) {

	const store = storeFromState(state);
	const context = {};
	let data = {
		__PRELOADED_STATE: state
	};

	data.children = ReactDOMServer.renderToString(
		<StaticRouter location={url} context={context}>
			<SheetsRegistryProvider registry={sheets}>
				<Drafterbit store={store}/>
			</SheetsRegistryProvider>
		</StaticRouter>
	);

	return ReactDOMServer.renderToStaticMarkup(<Html {...data} />);

};


export default Main;
