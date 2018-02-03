import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../actions';
import { withRouter } from 'react-router-dom'
import Style from './Login.style';
import jss from '../../../../../jss-config';

// TODO create HOC for jss

class Register extends React.Component {


	render() {

		const sheet = jss.createStyleSheet(Style);
		let { classes } = sheet;

		return (
			<section className="h-100 my-login-page">
				<div className="container h-100">
					<div className="row justify-content-md-center h-100">
						<div className={classes.cardWrapper}>
							<div className={`brand ${classes.brandContainer}`}>
								<img className={classes.brandImg} src="/img/drafterbit-logo.png" />
							</div>
							<div className={`card fat ${classes.cardFatPadding}`}>
								<div className="card-body">
									<h4 className={`card-title ${classes.cardTitleMargin}`}>Login</h4>
									<form onSubmit={(e) => {
										e.preventDefault();
										this.doLogin(e);
									}}>
										<div className="form-group">
											<label htmlFor="email">E-Mail Address</label>
											<input type="email" name="email" className={`form-control ${classes.formControlBorder}`} id="email" aria-describedby="emailHelp"/>
										</div>

										<div className="form-group">
											<label htmlFor="password" className={classes.labelWidth}>Password
												<a href="/forgot-password" className="float-right">
													Forgot Password?
												</a>
											</label>
											<input id="password" type="password" className={`form-control ${classes.formControlBorder}`} name="password" required data-eye />
										</div>

										<div className="form-group">
											<label>
												<input type="checkbox" name="remember" /> Remember Me
											</label>
										</div>

										<div className={`form-group no-margin ${classes.noMargin}`}>
											<button type="submit" className="btn btn-primary btn-block">
												Login
											</button>
										</div>
										<div className={`${classes.marginTop20} text-center`}>
											Don't have an account? <a href="/register">Create account</a>
										</div>
									</form>
								</div>
							</div>
							<div className={classes.loginFooter}>
								Copyright &copy; 2017 &mdash; drafterbit
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.user.currentUser
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);