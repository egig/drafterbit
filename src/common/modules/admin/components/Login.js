import React from 'react';

class Login extends React.Component {

	render() {
		return (
			<section className="hero is-fullheight">
				<div className="hero-body">
					<div className="container has-text-centered">
						<div className="column is-4 is-offset-4">
							<div className="box">
								<h3 className="title has-text-grey">Login</h3>
								<p className="subtitle has-text-grey">Please login to proceed.</p>
								<form>
									<div className="field">
										<div className="control">
											<input className="input is-large" type="email" placeholder="Your Email" autoFocus="" />
										</div>
									</div>
									<div className="field">
										<div className="control">
											<input className="input is-large" type="password" placeholder="Your Password" />
										</div>
									</div>
									<a className="button is-block is-info is-large">Login</a>
								</form>
							</div>
							<p className="has-text-grey">
								<a href="../">Sign Up</a> &nbsp;·&nbsp;
								<a href="../">Forgot Password</a> &nbsp;·&nbsp;
								<a href="../">Need Help?</a>
							</p>
						</div>
					</div>
				</div>
			</section>
		)
	}
}

export default Login;