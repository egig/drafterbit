import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AuthCard from './AuthCard';
import ApiClient from '../ApiClient';
import './Register.css';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';

import { Form, Input, Button, Checkbox } from 'antd';

class Register extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errorText: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(values) {
        let client = his.props.drafterbit.getApiClient2();
        return client
            .createUser(
                values.full_name,
                values.email,
                values.password
            )
            .then(response => {
                this.props.history.push('/register-success');
            })
	        .catch(e => {
		        this.setState({
			        errorText: e.message
		        });
	        });
    }

    render() {

        return (
            <AuthCard title="Register">
                <Helmet>
                    <title>Register - {this.props.drafterbit.getConfig("appName")}</title>
                </Helmet>

	            {this.state.errorText &&
		            <div className="alert alert-warning">
			            {this.state.errorText}
		            </div>
	            }

                <Form
                    layout="vertical"
                    onFinish={this.onSubmit}>
                    <Form.Item label="Full Name">
                        <Input name="full_name" placeholder="Full Name" />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input name="email" placeholder="Email" />
                    </Form.Item>
                    <Form.Item label="Password">
                        <Input type="password" name="password" placeholder="Password" />
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