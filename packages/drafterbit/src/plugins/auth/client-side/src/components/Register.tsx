import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AuthCard from './AuthCard';
import './Register.css';
// @ts-ignore
import withDrafterbit from '@drafterbit/common/dist/client-side/withDrafterbit';

import { Form, Input, Button, Checkbox } from 'antd';
import ClientSide from "../../../../admin/client-side/src/ClientSide";

type Props = {
    $dt: ClientSide
    t: any,
    history: any
}

type State = {
    errorText: string
}

class Register extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);

        this.state = {
            errorText: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(values: any) {
        let client = this.props.$dt.getApiClient();
        return client
            .createUser(
                values.full_name,
                values.email,
                values.password
            )
            .then(() => {
                this.props.history.push('/register-success');
            })
	        .catch((e: any) => {
		        this.setState({
			        errorText: e.message
		        });
	        });
    }

    render() {

        return (
            <AuthCard title="Register">
                <Helmet>
                    <title>Register - {this.props.$dt.getConfig("appName")}</title>
                </Helmet>

	            {this.state.errorText &&
		            <div className="alert alert-warning">
			            {this.state.errorText}
		            </div>
	            }

                <Form
                    size="large"
                    layout="vertical"
                    onFinish={this.onSubmit}>
                    <Form.Item label="Full Name">
                        <Input name="full_name" placeholder="Full Name" />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input name="email" placeholder="Email" />
                    </Form.Item>
                    <Form.Item label="Password">
                        <Input.Password name="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Agree with Term & condition</Checkbox>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" className="register-form-button" type="primary">Submit</Button>
                    </Form.Item>
                    Or  <Link to="/login">Login</Link>
                </Form>
            </AuthCard>
        );
    }
}

export default withDrafterbit(Register);