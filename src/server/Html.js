import React from 'react';
import { Route, Link } from 'react-router-dom';

const Html = function (props) {
    return (
        <html>
            <head>
	            {props.head.title.toComponent()}
		            <meta charSet="utf-8" />
		            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
		            <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.css" />
                <link rel="stylesheet" type="text/css" href="/css/common.css"  />
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{__html: props.children}} />
                <script dangerouslySetInnerHTML={{
                    __html: 'window.__PRELOADED_STATE='+JSON.stringify(props.__PRELOADED_STATE)}}
                ></script>
                <script src="/bundle.js"></script>
            </body>
        </html>
    );
};

module.exports = Html;