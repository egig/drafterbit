import React from 'react';
import { Link } from 'react-router-dom'
import Style from './ForgotPassword.style';
import jss from '../../../../../jss-config';
import AuthCard from './AuthCard';


// TODO create HOC for jss

class ForgotPassword extends React.Component {

	render() {

		const sheet = jss.createStyleSheet(Style);
		let { classes } = sheet;

		return (
			<AuthCard title="Forgot Password">
				<form >

					<div className="form-group">
						<label htmlFor="email">E-Mail</label>
						<input type="email" name="email" className={`form-control ${classes.formControlBorder}`} id="email" aria-describedby="emailHelp"/>
						<div className="form-text text-muted">
							By clicking "Reset Password" we will send a password reset link
						</div>
					</div>

					<div className={`form-group no-margin ${classes.noMargin}`}>
						<button type="submit" className={`btn btn-primary btn-block ${classes.btnPadding}`}>
							Submit
						</button>
					</div>
				</form>
			</AuthCard>
		);
	}
}

export default ForgotPassword;