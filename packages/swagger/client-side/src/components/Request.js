import React from 'react';
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { Card } from 'antd';

class Request extends React.Component {

    render() {
        let t = this.props.t;

        return (
            <Card>
                <SwaggerUI url="/swagger.json" />
            </Card>
        );
    }
}

export default Request;