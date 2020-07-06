import React  from 'react';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import { Row, Col, Card, Form, Input, Radio, Button, message } from 'antd'

class ApiKey extends React.Component {

    formRef = React.createRef();

    componentDidMount() {
        let id = parseInt(this.props.match.params.api_key_id);
        if (id !== 0) {
            let client = this.props.$dt.getApiClient();
            client.getApiKey(this.props.match.params.api_key_id)
                .then(r => {
                    this.formRef.current.setFieldsValue({
                        restriction_type: r.restriction_type,
                        name: r.name,
                        key: r.key,
                        restriction_value: r.restriction_value
                    })
                });
        }

    }

    onValuesChange = (changed, all) => {
        if (changed["restriction_type"]) {
            this.setState({
                restrictionType: changed["restriction_type"]
            });
        }
    };

    onFinish = (values) => {

        let id = parseInt(this.props.match.params.api_key_id);
        let client =  this.props.$dt.getApiClient();
        if (id === 0) {
           client.createApiKey(
                values.name,
                values.key,
                values.restriction_type,
                values.restriction_value
            ).then(r => {
               message.success('Api key successfully saved');

                window.setTimeout(() => {
                    this.props.history.push(`/api_keys/${r._id}`);
                }, 1500)
            });
        } else {
            client.updateApiKey(
                this.props.match.params.api_key_id,
                values.name,
                values.key,
                values.restriction_type,
                values.restriction_value
            ).then(r => {
                message.success('Api key successfully updated');
            });
        }
    };

    render() {

        return (
            <>
                <Row>
                    <Col span={12}>
                        <Card title="Create Api Key">
                            <Form layout="vertical"
                                  ref={this.formRef}
                                  onFinish={this.onFinish}
                                  initialValues={{
                                      restriction_type: "0"
                                  }}
                                  onValuesChange={this.onValuesChange}>
                                <Form.Item label="Name" name="name">
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Key" name="key" disabled>
                                    <Input readOnly placeholder="GENERATED"/>
                                </Form.Item>
                                <Form.Item name="restriction_type" label="Restriction Type">
                                    <Radio.Group>
                                        <Radio.Button value="0">None</Radio.Button>
                                        <Radio.Button value="1">HTTP Referrer</Radio.Button>
                                        <Radio.Button value="2">IP Address</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, currentValues) => prevValues.restriction_type !== currentValues.restriction_type}
                                >{(props)  => {
                                    let rType = parseInt(props.getFieldValue('restriction_type'));
                                    if (rType === 0) {
                                        return null;
                                    }

                                    return (
                                        <Form.Item label={rType === 1 ? "HTTP Referrer" : "IP Address"}
                                                   name="restriction_value">
                                            <Input/>
                                        </Form.Item>
                                    )

                                }}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Save</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

export default withDrafterbit(ApiKey)