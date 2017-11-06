import React from 'react';
import ReactDOM from 'react-dom';
import Drafterbit from '../common/Drafterbit';
import { BrowserRouter } from 'react-router-dom'
import storeFromState from '../common/storeFromState'
import moment from 'moment';

moment.locale('id', {
	months: 'januari_februari_maret_april_mei_juni_juli_agustus_september_oktober_november_desember'.split('_'),
	monthsShort: 'jan_feb_mar_apr_mei_jun_jul_agu_sep_okt_nov_des'.split('_')
});

const store = storeFromState(window.__PRELOADED_STATE);

ReactDOM.render(
	<BrowserRouter>
		<Drafterbit store={store} />
	</BrowserRouter>, document.getElementById('app'));


