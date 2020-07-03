import React from 'react';
import { Link } from 'react-router-dom'
import AuthCard from './AuthCard';
import { Helmet } from 'react-helmet';
import translate from '@drafterbit/common/client-side/translate';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import { setCookie } from '@drafterbit/common/client-side/cookie';

import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import './Login.css'
import ApiClient from '../ApiClient';



class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errorText: ''
        }
    }

    doLogin = (values) => {
        let email = values.email;
        let password = values.password;

        let client = this.props.drafterbit.getApiClient();
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
        return (
            <AuthCard title={t('login:title')}>
                <Helmet>
                    <title>Login - {this.props.drafterbit.getConfig("appName")}</title>
                </Helmet>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.doLogin}
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
                        <Link to="/forgot-password" className="login-form-forgot">Forgot Password?</Link>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                    Or  <Link to="/register">Create account</Link>
                </Form>
            </AuthCard>
        );

        // return (
        //     <AuthCard title={t('login:title')}>
                {/*<Helmet>*/}
                {/*    <title>Login - {this.props.drafterbit.getConfig("appName")}</title>*/}
                {/*</Helmet>*/}

        //         {this.state.errorText &&
        //             <div className="alert alert-warning">
        //                 {this.state.errorText}
        //             </div>
        //         }
        //         <form onSubmit={(e) => {
        //             e.preventDefault();
        //             this.doLogin(e);
        //         }}>
        //             <div className="form-group">
        //                 <label htmlFor="email">E-Mail Address</label>
        //                 <input type="email" name="email" className={`form-control login-formControlBorder`} id="email" aria-describedby="emailHelp"/>
        //             </div>
        //
        //             <div className="form-group">
        //                 <label htmlFor="password" className="login-labelWidth">Password
        //                     <Link to="/forgot-password" className="float-right">
        //                         Forgot Password?
        //                     </Link>
        //                 </label>
        //                 <input id="password" type="password" className={`form-control login-formControlBorder`} name="password" required data-eye />
        //             </div>
        //
        //             <div className="form-group">
        //                 <label>
        //                     <input type="checkbox" name="remember" /> Remember Me
        //                 </label>
        //             </div>
        //
        //             <div className={`form-group no-margin login-noMargin`}>
        //                 <button type="submit" className={`btn btn-success btn-block login-btnPadding`}>
        //                     Login
        //                 </button>
        //             </div>
        //             <div className={`login-marginTop20 text-center`}>
        //                 Don't have an account? <Link to="/register">Create account</Link>
        //             </div>
        //         </form>
        //     </AuthCard>
        // );
    }
}

export default translate(['login'])(withDrafterbit(Login));