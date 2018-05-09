import React from 'react';
import { Link } from 'react-router-dom';
import Style from './ProjectNav.style';
import withStyle from '../../../withStyle';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

class ProjectNav extends React.Component {
	render() {

		let { classNames, match } = this.props;

		return (
			<nav className={`col-md-2 d-none d-md-block bg-light ${classNames.sidebar}`}>
				<div className={classNames.sidebarSticky}>
					{/*<h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>*/}
						{/*<span><i className="icon-grid"/> Dashboard</span>*/}
					{/*</h6>*/}
					{/*<ul className="nav flex-column">*/}
						{/*<li className="nav-item">*/}
							{/*<Link className="nav-link" to={`/project/${match.params.project_id}`}>*/}
								{/*<i className="icon-home"/> Home*/}
							{/*</Link>*/}
						{/*</li>*/}
					{/*</ul>*/}

					{/*<h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>*/}
						{/*<span><i className="icon-docs"/> Content</span>*/}
					{/*</h6>*/}
					{/*<ul className="nav flex-column mb-2">*/}
						{/*{!this.props.project.content_types.length &&*/}
							{/*<li className="nav-item">*/}
								{/*<Link className="nav-link" to={`/project/${this.props.project.id}/content_types/new`}>*/}
									{/*<i className="icon-plus"/> Add Content Type*/}
								{/*</Link>*/}
							{/*</li>*/}
						{/*}*/}

						{/*{this.props.project.content_types.map((ct, i) => {*/}
							{/*return (*/}
								{/*<li className="nav-item" key={i}>*/}
									{/*<Link className="nav-link" to={`/project/${this.props.project.id}/contents/${ct.slug}`}>*/}
										{/*<i className="icon-doc"/> {ct.name}*/}
									{/*</Link>*/}
								{/*</li>*/}
							{/*)*/}
						{/*})}*/}
					{/*</ul>*/}

					{/*<h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>*/}
						{/*<span><i className="icon-equalizer"/> Setting</span>*/}
					{/*</h6>*/}
					<ul className="nav flex-column mb-2">
						<li className="nav-item">
							<Link className="nav-link" to={`/project/${match.params.project_id}`}>
								<i className="icon-home"/> Home
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={`/project/${this.props.project.id}/content_types`}>
								<i className="icon-puzzle"/> Content Types
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={`/project/${this.props.project.id}/settings`}>
								<i className="icon-settings"/> Settings
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={`/project/${this.props.project.id}/api_keys`}>
								<i className="icon-key"/> Api Keys
							</Link>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		project: state.project.project
	};
};

export default withRouter(connect(mapStateToProps)(withStyle(Style)(ProjectNav)));