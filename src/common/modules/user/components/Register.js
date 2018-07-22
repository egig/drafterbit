import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Style from './Register.style';
import AuthCard from './AuthCard';
import withStyle from '../../../withStyle';
import apiClient from '../../../../apiClient';

class Register extends React.Component {

    onSubmit(form) {
        return apiClient.createClient({})
            .createUser(
                form.first_name.value,
                form.last_name.value,
                form.email.value,
                form.password.value
            )
            .then(response => {
                this.props.history.push('/register-success');
            });
    }

    render() {

        let classes = this.props.classNames;

        return (
            <AuthCard title="Register">
                <Helmet>
                    <title>Register - drafterbit</title>
                </Helmet>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    this.onSubmit(e.target);
                }}>
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input type="text" name="first_name" className={`form-control ${classes.formControlBorder}`} id="first_name" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <input type="text" name="last_sname" className={`form-control ${classes.formControlBorder}`} id="last_name" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-Mail</label>
                        <input type="email" name="email" className={`form-control ${classes.formControlBorder}`} id="email" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" className={`form-control ${classes.formControlBorder}`} name="password" required />
                    </div>

                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="agree_term" /> I agree to the Terms and Conditions
                        </label>
                    </div>

                    <div className={`form-group no-margin ${classes.noMargin}`}>
                        <button type="submit" className={`btn btn-success btn-block ${classes.btnPadding}`}>
							Register
                        </button>
                    </div>
                    <div className={`${classes.marginTop20} text-center`}>
						Already have an account? <Link to="/login">Login</Link>
                    </div>
                </form>
            </AuthCard>
        );
    }
}

export default withStyle(Style)(Register);