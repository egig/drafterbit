import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AuthCard from './AuthCard';

class RegisterSuccess extends React.Component {

    render() {

        return (
            <AuthCard title="Register Success">
                <Helmet>
                    <title>Register Success - draferbit</title>
                </Helmet>
                <div>
					Congratulation ! Your account has been created, you can now <Link to="/login">Login</Link>.
                </div>
            </AuthCard>
        );
    }
}

export default RegisterSuccess;