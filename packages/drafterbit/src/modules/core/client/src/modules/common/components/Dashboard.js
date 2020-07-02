import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate';
import { Row, Col, Card } from 'antd'

class Dashboard extends React.Component {

    render() {

        return (
            <Row>
                <Col span={24}>
                    <Card title="Dashboard">
                    <p>Welcome !</p>
                    </Card>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.USER.currentUser
    };
};

export default translate(['dashboard'])(connect(mapStateToProps)(Dashboard));