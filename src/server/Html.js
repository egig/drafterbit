import React from 'react';
import { Route, Link } from 'react-router-dom';

const Html = function (props) {
    return (
        <html>
            <head>
                <title>page_title</title>
		            <meta charSet="utf-8" />
		            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
		            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous" />
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