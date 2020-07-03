import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Shell from './components/Shell';

// CSS dependency first
import 'simple-line-icons/css/simple-line-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import "antd/dist/antd.css";
import './index.css';

moment.locale('id', {
    months: 'januari_februari_maret_april_mei_juni_juli_agustus_september_oktober_november_desember'.split('_'),
    monthsShort: 'jan_feb_mar_apr_mei_jun_jul_agu_sep_okt_nov_des'.split('_')
});

(($dt) => {

    $dt.initApiClient();

    let defaultState = $dt.createDefaultState();

    let stateFilters =  $dt.modules.map(mo => {
        if(typeof mo.stateFilter === "function") {
            return mo.stateFilter(defaultState);
        }
    }).filter(i => !!i);

    Promise.all(stateFilters)
        .then(() => {
            $dt.storeFromState(defaultState);
            ReactDOM.render(<Shell drafterbit={$dt}/>, document.getElementById('app'));
        })
        .catch(e => {
            console.error(e);
            let message = "Oops, Please try again in few minutes";
            ReactDOM.render(<div style={{margin: "25px"}}>{ message }</div>, document.getElementById('app'));
        });

})(window.$dt);