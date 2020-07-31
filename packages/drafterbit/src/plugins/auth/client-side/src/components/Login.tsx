import React from 'react';
import { Link } from 'react-router-dom'
import AuthCard from './AuthCard';
import { Helmet } from 'react-helmet';
// @ts-ignore
import { translate } from '@drafterbit/common';
// @ts-ignore
import { cookie } from '@drafterbit/common';
const { setCookie } = cookie;
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import './Login.css'
import ClientSide from "../../../../admin/client-side/src/ClientSide";
import DTContext from "../../../../admin/client-side/src/DTContext";


type Props = {
    $dt: ClientSide
    t: any
}

type State = {
    errorText: string
}

class Login extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);

        this.state = {
            errorText: ''
        }
    }

    doLogin = ($dt: ClientSide, values: any) => {
        let email = values.email;
        let password = values.password;

        let client = $dt.getApiClient();
        client.createUserSession(email, password)
		    .then((r: any) => {
			    // TODO redirect to referrer
                setCookie("dt_auth_token", r.token, 4);
                window.location.replace("/");
		    })
		    .catch((e: any) => {
		    	this.setState({
		    		errorText: e.message
			    })
		    });

    };

    render() {

        let t = this.props.t;

        return(
            <DTContext.Consumer>
                {($dt: any) => {
                    let setting = $dt.store.getState().COMMON.settings.General;
                    let appName = setting.app_name;
                    const onFinish = (values: any) => {
                        this.doLogin($dt, values)
                    };
                    
                    return (
                        <AuthCard title={t('login:title')}>
                            <Helmet>
                                <title>Login - {appName}</title>
                            </Helmet>
                            {this.state.errorText &&
                            <Alert message={this.state.errorText} type="warning" closable onClose={() => {
                                this.setState({
                                    errorText: "",
                                })
                            }}  />
                            }
                            <div style={{marginBottom: "6px"}}/>
                            <Form
                                size="large"
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
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
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