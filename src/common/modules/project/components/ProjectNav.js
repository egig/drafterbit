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
					<h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>
						<span>General</span>
					</h6>
					<ul className="nav flex-column">
						<li className="nav-item">
							<Link className="nav-link" to={`/project/${match.params.project_id}`}>
								Dashboard <span className="sr-only">(current)</span>
							</Link>
						</li>
					</ul>

					<h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>
						<span>Content</span>
					</h6>
					<ul className="nav flex-column mb-2">
						{!this.props.project.content_types.length &&
							<li className="nav-item">
								<Link className="nav-link" to={`/project/${this.props.project.id}/content_types/add`}>
										+ Add Content Type
								</Link>
							</li>
						}

						{this.props.project.content_types.map((ct, i) => {
							return (
								<li className="nav-item" key={i}>
									<Link className="nav-link" to={`/project/${this.props.project.id}/contents/${ct.slug}`}>
										{ct.name}
									</Link>
								</li>
							)
						})}
					</ul>

					<h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>
						<span>Setting</span>
					</h6>
					<ul className="nav flex-column mb-2">
						<li className="nav-item">
							<Link className="nav-link" to={`/project/settings`}>
								General
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={`/project/${this.props.project.id}/content_types`}>
								Content Types
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={`/project/${this.props.project.id}/api_keys`}>
								Api Keys
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