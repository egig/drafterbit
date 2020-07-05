import React from 'react';
import { connect } from 'react-redux';
import translate from '@drafterbit/common/client-side/translate';
import {Row, Col, Card} from 'antd'
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';

class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            settings: []
        }
    }

    componentDidMount() {
        let client = this.props.$dt.getApiClient();
        client.getSettings()
            .then(settings => {
                this.setState({
                    settings
                })
            })
    }

    render() {

        return (
            <Row>
                <Col span={24}>
                    <Card title="Settings">
                        {this.state.settings.map((setting, i) => {
                            return (<table key={i}>
                                <tbody>
                                {Object.keys(setting).map((k,i) => {
                                    if (['fieldset_name', '_id'].indexOf(k) === -1) {
                                        return <tr key={i}><td>{k}</td><td> : {setting[k]}</td></tr>
                                    }
                                })}
                                </tbody>
                            </table>)
                        })}
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

export default translate(['dashboard'])(connect(mapStateToProps)(withDrafterbit(Settings)));