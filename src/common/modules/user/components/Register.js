import React from 'react';
import { Link } from 'react-router-dom'
import Style from './Register.style';
import jss from '../../../../../jss-config';
import AuthCard from './AuthCard';


// TODO create HOC for jss

class Register extends React.Component {

	render() {

		const sheet = jss.createStyleSheet(Style);
		let { classes } = sheet;

		return (
			<AuthCard title="Register">
				<form >
					<div className="form-group">
						<label htmlFor="email">Name</label>
						<input type="text" name="name" className={`form-control ${classes.formControlBorder}`} id="name" aria-describedby="emailHelp"/>
					</div>

					<div className="form-group">
						<label htmlFor="email">E-Mail</label>
						<input type="email" name="email" className={`form-control ${classes.formControlBorder}`} id="email" aria-describedby="emailHelp"/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input id="password" type="password" className={`form-control ${classes.formControlBorder}`} name="password" required data-eye />
					</div>

					<div className="form-group">
						<label>
							<input type="checkbox" name="agree_term" /> I agree to the Terms and Conditions
						</label>
					</div>

					<div className={`form-group no-margin ${classes.noMargin}`}>
						<button type="submit" className={`btn btn-primary btn-block ${classes.btnPadding}`}>
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

export default Register;