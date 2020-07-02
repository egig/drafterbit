import React from 'react';
import { Helmet } from 'react-helmet';
import AuthCard from './AuthCard';
import { Link } from 'react-router-dom'


import { Form, Input, Button, Checkbox } from 'antd';


class ForgotPassword extends React.Component {

    onSubmit(from) {
        // TODO send email
        this.props.history.push('forgot-password-requested');
    }

    render() {

        return (
            <AuthCard title="Forgot Password">
                <Helmet>
                    <title>Forgot Password</title>
                </Helmet>

                <Form
                    initialValues={{}}
                    onFinish={this.onSubmit}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input placeholder="Email" />
                        <div className="form-text text-muted">
                            By clicking "Reset Password" we will send a password reset link
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="">
                            Submit
                        </Button>
                    </Form.Item>
                    <Link to="/login">Back to Login Page</Link>
                </Form>
            </AuthCard>
        );
    }
}

export default ForgotPassword;