import React from 'react';
import { Helmet } from 'react-helmet';
import AuthCard from './AuthCard';
import { Link } from 'react-router-dom'


import { Form, Input, Button, Checkbox } from 'antd';

type Props = {
    history: any
}

class ForgotPassword extends React.Component<Props, {}> {

    constructor(props: any) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(values: any) {
        // TODO send email
        this.props.history.push('/forgot-password-requested');
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
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input name="email" placeholder="Email" />
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