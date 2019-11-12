import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AuthCard from './AuthCard';
import ApiClient from '../ApiClient';
import './Register.css';
import withDrafterbit from 'drafterbit-module-admin/client/src/withDrafterbit';

class Register extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errorText: ''
        };
    }

    onSubmit(form) {
        let client = new ApiClient({});
        return client
            .createUser(
                form.full_name.value,
                form.email.value,
                form.password.value
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
                    <title>Register - drafterbit</title>
                </Helmet>

	            {this.state.errorText &&
		            <div className="alert alert-warning">
			            {this.state.errorText}
		            </div>
	            }

	            <form onSubmit={(e) => {
                    e.preventDefault();
                    this.onSubmit(e.target);
                }}>
                    <div className="form-group">
                        <label htmlFor="full_name">Full Name</label>
                        <input type="text" name="full_name" className={'form-control register-formControlBorder'} id="full_name" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-Mail</label>
                        <input type="email" name="email" className={'form-control register-formControlBorder'} id="email" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" className={'form-control register-formControlBorder'} name="password" required />
                    </div>

                    <div className="form-group">
                        <span>
                            <input type="checkbox" name="agree_term" /> I agree to the Terms and Conditions
                        </span>
                    </div>

                    <div className={'form-group register-noMargin'}>
                        <button type="submit" className={'btn btn-success btn-block register-btnPadding'}>
                            Register
                        </button>
                    </div>
                    <div className={'register-marginTop20 text-center'}>
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </form>
            </AuthCard>
        );
    }
}

export default withDrafterbit(Register);