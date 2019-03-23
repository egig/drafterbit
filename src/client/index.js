import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import moment from 'moment';
import i18next from 'i18next';
import tinymce from 'tinymce/tinymce';
// A theme is also required
import 'tinymce/themes/silver/theme';

// Any plugins you want to use has to be imported
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';


// CSS dependency first
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.css';
import './index.css';

import  Drafterbit from './Drafterbit';
import storeFromState  from './storeFromState';
import apiClient from './apiClient';


// Initialize the app
tinymce.init({
    selector: '#tiny',
    plugins: ['paste', 'link']
});


const drafterbit = {
    apiClient: apiClient.createClient({
        baseURL: 'htt://localhost:3003'
    })
};

const i18n = i18next.createInstance();
i18n.init({
    lng: 'id',
    fallbackLng: 'en',
    debug: true,
    resources: [],
});

moment.locale('id', {
    months: 'januari_februari_maret_april_mei_juni_juli_agustus_september_oktober_november_desember'.split('_'),
    monthsShort: 'jan_feb_mar_apr_mei_jun_jul_agu_sep_okt_nov_des'.split('_')
});

const store = storeFromState(window.__PRELOADED_STATE__);
let languageContext = {namespaces: [], i18n};

ReactDOM.render(
    <HashRouter>
        <Drafterbit
            store={store}
            drafterbit={drafterbit}
            languageContext={languageContext} />
    </HashRouter>, document.getElementById('app'));


