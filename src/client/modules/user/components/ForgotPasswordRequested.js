import React from 'react';
import { Helmet } from 'react-helmet';
import AuthCard from './AuthCard';

class ForgotPasswordRequested extends React.Component {

    render() {
        return (
            <AuthCard title="Forgot Password">
                <Helmet>
                    <title>Reset Password Requested - draferbit</title>
                </Helmet>
                <p>If your email address already registered, then you will receive a password recovery link at your email address in a few minutes.</p>
            </AuthCard>
        );
    }
}

export default ForgotPasswordRequested;