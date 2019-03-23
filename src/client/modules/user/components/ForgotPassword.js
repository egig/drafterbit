import React from 'react';
import { Helmet } from 'react-helmet';
import AuthCard from './AuthCard';

class ForgotPassword extends React.Component {

    onSubmit(from) {
        // TODO send email
        this.props.history.push('forgot-password-requested');
    }

    render() {

        return (
            <AuthCard title="Forgot Password">
                <Helmet>
                    <title>Forgot Password - draferbit</title>
                </Helmet>
                <form onSubmit={(e) => { e.preventDefault(); this.onSubmit(e.target); }}>
                    <div className="form-group">
                        <label htmlFor="email">E-Mail</label>
                        <input type="email" name="email" className={`form-control auth_card-formControlBorder`} id="email" aria-describedby="emailHelp"/>
                        <div className="form-text text-muted">
                            By clicking "Reset Password" we will send a password reset link
                        </div>
                    </div>

                    <div className={`form-group no-margin auth_card-noMargin`}>
                        <button type="submit" className={`btn btn-success btn-block auth_card-btnPadding`}>
                            Submit
                        </button>
                    </div>
                </form>
            </AuthCard>
        );
    }
}

export default ForgotPassword;