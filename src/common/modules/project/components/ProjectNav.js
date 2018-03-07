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
						<Link className="d-flex align-items-center text-muted" to="/project/projectId/content-types/new">
							<span data-feather="plus-circle"/>
						</Link>
					</h6>
					<ul className="nav flex-column">
						<li className="nav-item">
							<Link className="nav-link" to={`/project/${match.params.project_id}`}>
								<span data-feather="home"/>
								Dashboard <span className="sr-only">(current)</span>
							</Link>
						</li>
					</ul>

					<h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>
						<span>Content</span>
						<Link className="d-flex align-items-center text-muted" to="/project/projectId/content-types/new">
							<span data-feather="plus-circle"/>
						</Link>
					</h6>
					<ul className="nav flex-column mb-2">
						{this.props.project.content_types.map((ct, i) => {
							return (
								<li className="nav-item" key={i}>
									<Link className="nav-link" to={`/project/${this.props.project.id}/contents/${ct.slug}`}>
										<span data-feather="file-text"/>
										{ct.name}
									</Link>
								</li>
							)
						})}
					</ul>

					<h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>
						<span>Setting</span>
						<Link className="d-flex align-items-center text-muted" to="/project/projectId/content-types/new">
							<span data-feather="plus-circle"/>
						</Link>
					</h6>
					<ul className="nav flex-column mb-2">
						<li className="nav-item">
							<Link className="nav-link" to={`/project/${this.props.project.id}/content_types`}>
								<span data-feather="file-text"/>
								Content Types
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={`/project/${this.props.project.id}/api_keys`}>
								<span data-feather="file-text"/>
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

export default withRouter(withStyle(Style)(connect(mapStateToProps)(ProjectNav)));