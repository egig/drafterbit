import React from 'react';
import { Link } from 'react-router-dom'
import AuthCard from './AuthCard';
import { Helmet } from 'react-helmet';
import translate from '@drafterbit/common/client-side/translate';
import { setCookie } from '@drafterbit/common/client-side/cookie';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import DTContext from '@drafterbit/common/client-side/DTContext';

import './Login.css'


class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errorText: ''
        }
    }

    doLogin = ($dt, values) => {
        let email = values.email;
        let password = values.password;

        let client = $dt.getApiClient();
        client.createUserSession(email, password)
		    .then(r => {
			    // TODO redirect to referrer
                setCookie("dt_auth_token", r.token);
                window.location.replace("/");
		    })
		    .catch(e => {
		    	this.setState({
		    		errorText: e.message
			    })
		    });

    };

    render() {

        let t = this.props.t;

        return(
            <DTContext.Consumer>
                {$dt => {
                    let setting = $dt.store.getState().COMMON.settings.General;
                    let appName = setting.app_name;
                    const onFinish = (values) => {
                        this.doLogin($dt, values)
                    };
                    
                    return (
                        <AuthCard title={t('login:title')}>
                            <Helmet>
                                <title>Login - {appName}</title>
                            </Helmet>
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}
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
                                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Password!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Password"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox>Remember me</Checkbox>
                                    </Form.Item>
                                    {setting.enable_reset_password &&
                                    <Link to="/forgot-password" className="login-form-forgot">Forgot Password?</Link>
                                    }
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Log in
                                    </Button>
                                </Form.Item>
                                {setting.enable_register &&
                                <span>Or  <Link to="/register">Create account</Link></span>
                                }
                            </Form>
                        </AuthCard>
                    )
                }}
            </DTContext.Consumer>
        );
    }
}

export default translate(['login'])(Login);