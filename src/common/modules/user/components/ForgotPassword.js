import React from 'react';
import { Helmet } from 'react-helmet';
import Style from './ForgotPassword.style';
import AuthCard from './AuthCard';
import withStyle from '../../../withStyle';

class ForgotPassword extends React.Component {

	render() {

		let classes = this.props.classNames;

		return (
			<AuthCard title="Forgot Password">
				<Helmet>
					<title>Forgot Password - draferbit</title>
				</Helmet>
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

export default withStyle(Style)(ForgotPassword);