import React from 'react';
import withStyle from '../../../withStyle';
import Style from './Layout.style';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Layout extends React.Component {

	componentDidMount() {
		this.props.getProjects();
	}

	render() {

		let { classNames, t, projects } = this.props;

		return (
			<span>
				<nav className={`${classNames.navbar} navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0`}>
		      <a className={`${classNames.navbarBrand} navbar-brand col-sm-3 col-md-2 mr-0`} href="#">drafterbit</a>
					<form className={classNames.navbarForm}>
						<select className={classNames.navbarProjectSelector}>
							<option>{t('layout.select_project')}</option>
							{projects.map((p,i) => {
								return (<option key={i} value={p.id}>{p.name}</option>)
							})}
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

const mapStateToProps = (state) => {
	return {
		projects: state.project.projects
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
};


export default translate()(withStyle(Style)(
	connect(mapStateToProps, mapDispatchToProps)(Layout
	)));