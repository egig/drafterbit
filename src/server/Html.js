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
	              {/*<!--TODO include react-table only when we need it -->*/}
                <link rel="stylesheet" type="text/css" href="/vendor/react-table/react-table.css"  />
                <link rel="stylesheet" type="text/css" href="/vendor/simple-line-icons/css/simple-line-icons.css" />
                <link rel="stylesheet" type="text/css" href="/css/common.css" />
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{__html: props.children}} />
                <script dangerouslySetInnerHTML={{
                    __html: 'window.__PRELOADED_STATE__='+JSON.stringify(props.__PRELOADED_STATE__)
                    +';window.__PRELOADED_LANGUAGE_RESOURCES__='+JSON.stringify(props.__PRELOADED_LANGUAGE_RESOURCES__)
                }}
                ></script>
                <script src="/bundle.js"></script>
            </body>
        </html>
    );
};

module.exports = Html;