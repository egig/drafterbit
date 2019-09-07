import React from 'react';
import Layout from './Layout';
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

class Request extends React.Component {

    render() {
        let t = this.props.t;

        return (
            <SwaggerUI url="/swagger.json" />            
        );
    }
}

export default Request;