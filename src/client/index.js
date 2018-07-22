import React from 'react';
import ReactDOM from 'react-dom';
import Drafterbit from '../common/Drafterbit';
import { BrowserRouter } from 'react-router-dom';
import storeFromState from '../common/storeFromState';
import moment from 'moment';
import createJSSInstance from '../createJSSInstance';
import i18next from 'i18next';
import apiClient from '../apiClient';

const jss = createJSSInstance();
const drafterbit = {
    apiClient: apiClient.createClient({
        baseURL: window.__DRAFTERBIT_CONFIG__.apiBaseURL
    })
};

const i18n = i18next.createInstance();
i18n.init({
    lng: window.__PRELOADED_STATE__.common.language,
    fallbackLng: 'en',
    debug: true,
    resources: window.__PRELOADED_LANGUAGE_RESOURCES__,
});

moment.locale('id', {
    months: 'januari_februari_maret_april_mei_juni_juli_agustus_september_oktober_november_desember'.split('_'),
    monthsShort: 'jan_feb_mar_apr_mei_jun_jul_agu_sep_okt_nov_des'.split('_')
});

const store = storeFromState(window.__PRELOADED_STATE__);
let languageContext = {namespaces: [], i18n};

ReactDOM.hydrate(
    <BrowserRouter>
        <Drafterbit
	        store={store} jss={jss}
	        drafterbit={drafterbit}
            languageContext={languageContext} />
    </BrowserRouter>, document.getElementById('app'));


