const React = require('react');
import jss from '../jss-config';
import {create as createInjectSheet} from 'react-jss';
export const injectSheet = createInjectSheet(jss);

export const styles = {

    button: {
        'color': '#333',
        'background-color': '#fff',
        'display': 'inline-block',
        'padding': '6px 12px',
        'margin-bottom': '0',
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '1.42857143',
        'text-align': 'center',
        'white-space': 'nowrap',
        'vertical-align': 'middle',
        '-ms-touch-action': 'manipulation',
        'touch-action': 'manipulation',
        'cursor': 'pointer',
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none',
        'background-image': 'none',
        'border': '1px solid #ccc',
        'border-radius': '4px',
        '&:hover': {
            background: 'blue'
        },
    },
    '@media (max-width: 768px)': {
        button: {
            'background-color': 'red',
        }
    },
};

const Button = function ({classes, text}) {

    return (<button className={classes.button} >{text}</button>);
};

export default  injectSheet(styles)(Button);