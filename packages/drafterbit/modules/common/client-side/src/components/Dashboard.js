import React from 'react';
import translate from '@drafterbit/common/client-side/translate';
import { Row, Col, Card, PageHeader } from 'antd'

class Dashboard extends React.Component {

    render() {

        return (
            <Row>
                <Col span={24}>
                    <PageHeader title="Dashboard">
                        <Card>
                            Welcome !
                        </Card>
                    </PageHeader>
                </Col>
            </Row>
        );
    }
}

export default translate(['dashboard'])(Dashboard);