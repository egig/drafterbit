import React from 'react';
import translate from '@drafterbit/common/client-side/translate';
import {Row, Col, Card} from 'antd'
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import {Form, Tabs, Input, Switch, message, Button} from 'antd';

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
    }

    componentDidMount() {
        let client = this.props.$dt.getApiClient();
        client.getSettings()
            .then(settings => {
                this.formRef.current.setFieldsValue(settings[0])
            })
    }

    onFinish = (values) => {
        this.props.$dt.getApiClient().setSettings(values)
            .then(() => {
                message.success("Settings successfully saved !")
            })
    }

    render() {

        return (
            <Row>
                <Col span={24}>
                    <Card title="Settings">
                        <Tabs>
                            <Tabs.TabPane tab="General" key="1">
                                <Form ref={this.formRef} layout="vertical" onFinish={this.onFinish}>
                                    <Form.Item name="fieldset_name" noStyle>
                                        <Input hidden/>
                                    </Form.Item>
                                    <Form.Item name="app_name" label="App Name">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="enable_register" label="Enable Register">
                                        <Switch/>
                                    </Form.Item>
                                    <Form.Item name="enable_reset_password" label="Enable Reset Password">
                                        <Switch/>
                                    </Form.Item>
                                    <Form.Item name="brand_img_url" label="Brand Image URL">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Save</Button>
                                    </Form.Item>
                                </Form>
                            </Tabs.TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default translate(['settings'])(withDrafterbit(Settings));