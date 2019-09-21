import React, { lazy } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import moment from 'moment';
import i18next from 'i18next';
import safeEval from 'safe-eval';

// CSS dependency first
import 'simple-line-icons/css/simple-line-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import Drafterbit from './Drafterbit';
import storeFromState  from './storeFromState';
import defaultState  from './defaultState';
import apiClient from './apiClient';
import {
    getCookie
} from './cookie';
import getProject from './getProject';
import getConfig from './getConfig';

// TODO
const drafterbit = window.__DRAFTERBIT__;

const i18n = i18next.createInstance();
i18n.init({
    lng: 'id',
    fallbackLng: 'en',
    debug: !!parseInt(getConfig("debug")),
    resources: [],
});

moment.locale('id', {
    months: 'januari_februari_maret_april_mei_juni_juli_agustus_september_oktober_november_desember'.split('_'),
    monthsShort: 'jan_feb_mar_apr_mei_jun_jul_agu_sep_okt_nov_des'.split('_')
});

let languageContext = {namespaces: [], i18n};

function getCurrentUserProject() {
    let token = getCookie('dt_auth_token');
    if(token) {
        return drafterbit.userApiClient.validateToken(token)
            .then(d => {

                if(d['is_valid']) {
                    let user = d['claims'];
                    user.token = token;

                    return drafterbit.userApiClient.getUserProject(user.id, getProject())
                        .then(project => {
                            user.project = project;
                            return user;
                        })
                }

                return null;
            })
    }

    return Promise.resolve(null);
}

Promise.all([
    // getCurrentUserProject(),
    // drafterbit.getApiClient().getFieldTypes(),
])
    .then(reslist => {
        // defaultState.USER.currentUser = {};
        renderApp(defaultState);
    })
    .catch(e => {

        console.log(e);

        let message = "Oops, Please try again in few minutes";

        if (e.status == 404) {
            message = "You don't have access to this project. Please contact your administrator.";
        }

        ReactDOM.render(<div style={{margin: "25px"}}>{ message }</div>, document.getElementById('app'));
    });

function renderApp(dState) {

    const store = storeFromState(dState, drafterbit);
    drafterbit.store = store;

    ReactDOM.render(
        <HashRouter>
            <Drafterbit
                store={store}
                drafterbit={drafterbit}
                languageContext={languageContext} />
        </HashRouter>, document.getElementById('app'));
}