import React from 'react';

class Nav extends React.Component {

	render() {
		return(
			<nav className="navbar is-dark">
				<div className="container">
					<div className="navbar-brand">
						<a className="navbar-item" href="https://bulma.io">
							AppName
						</a>
						<div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>

					<div id="navbarExampleTransparentExample" className="navbar-menu">
						<div className="navbar-start">
							<a className="navbar-item" href="/">
								Dashboard
							</a>
							<a className="navbar-item" href="/">
								Content
							</a>
							<a className="navbar-item" href="/">
								Users
							</a>
						</div>

						<div className="navbar-end">
							<div className="navbar-item">

								<div className="navbar-item has-dropdown is-hoverable">
									<a className="navbar-link" href="/documentation/overview/start/">
										User
									</a>
									<div className="navbar-dropdown is-boxed">
										<a className="navbar-item" href="/me">
											Profile
										</a>
										<a className="navbar-item" href="/admin/user/preference">
											Preference
										</a>
										<hr className="navbar-divider" />
										<a className="navbar-item" href="/logout">
											Logout
										</a>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
		)
	}
}

export default Nav;