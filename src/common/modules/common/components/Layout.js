import React from 'react';
import withStyle from '../../../withStyle';
import Style from './Layout.style';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

class Layout extends React.Component {
	render() {

		let { classNames, t } = this.props;

		return (
			<span>
				<nav className={`${classNames.navbar} navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0`}>
		      <a className={`${classNames.navbarBrand} navbar-brand col-sm-3 col-md-2 mr-0`} href="#">drafterbit</a>
					<form className={classNames.navbarForm}>
						<select className={classNames.navbarProjectSelector}>
							<option>{t('layout.select_project')}</option>
						</select>
					</form>
		      <ul className="navbar-nav px-3">
		        <li className="nav-item text-nowrap">
		          <a className="nav-link" href="/logout">Logout</a>
		        </li>
		      </ul>
		    </nav>
				<div className="container-fluid">
					{this.props.children}
		    </div>
			</span>
		);
	}
}

Layout.defaultProps = {
	title: "Untitled Page"
};


export default translate()(withStyle(Style)(Layout));