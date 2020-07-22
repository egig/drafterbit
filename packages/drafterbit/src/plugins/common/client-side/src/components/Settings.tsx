import React from 'react';
// @ts-ignore
import translate from '@drafterbit/common/dist/client-side/translate';
import {Row, Col, Card, PageHeader} from 'antd'
// @ts-ignore
import withDrafterbit from '@drafterbit/common/dist/client-side/withDrafterbit';
import {Form, Tabs, Input, Switch, message, Button} from 'antd';
import ClientSide from "../../../../admin/client-side/src/ClientSide";

type Props = {
    $dt?: ClientSide
}


class Settings extends React.Component<Props, {}> {

    formRef: React.RefObject<any>;

    constructor(props: any) {
        super(props);
        this.formRef = React.createRef();
    }

    componentDidMount() {
        // @ts-ignore
        let client = this.props.$dt.getApiClient();
        client.getSettings()
            .then((settings: any) => {
                // TODO support another fieldset
                this.formRef.current.setFieldsValue(settings[0])
            })
    }

    onFinish = (values: any) => {
        // @ts-ignore
        this.props.$dt.getApiClient().setSettings(values)
            .then(() => {
                message.success("Settings successfully saved !")
            })
    }

    render() {

        return (
            <Row>
                <Col span={12}>
                    <PageHeader
                        title="Settings"
                    >
                        <Card>
                            <Tabs>
                                <Tabs.TabPane tab="General" key="1">
                                    <Form ref={this.formRef} layout="vertical" onFinish={this.onFinish}>
                                        <Form.Item name="fieldset_name" noStyle>
                                            <Input hidden/>
                                        </Form.Item>
                                        <Form.Item name="app_name" label="App Name">
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item valuePropName="checked" name="enable_register" label="Enable Register">
                                            <Switch size="small"/>
                                        </Form.Item>
                                        <Form.Item valuePropName="checked" name="enable_reset_password" label="Enable Reset Password">
                                            <Switch size="small"/>
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
                    </PageHeader>
                </Col>
            </Row>
        );
    }
}

export default translate(['settings'])(withDrafterbit(Settings));