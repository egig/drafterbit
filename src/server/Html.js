import React from 'react';
import { Route, Link } from 'react-router-dom';

const Html = function (props) {
    return (
        <html>
            <head>
                <title>page_title</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
                <link rel="stylesheet" type="text/css" href="/css/react-md.indigo-blue.min.css" />
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