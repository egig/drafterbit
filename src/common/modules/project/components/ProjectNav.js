import React from 'react';
import { Link } from 'react-router-dom';
import Style from './ProjectNav.style';
import withStyle from '../../../withStyle';

class ProjectNav extends React.Component {
	render() {

		let { classNames } = this.props;

		return (
			<nav className={`col-md-2 d-none d-md-block bg-light ${classNames.sidebar}`}>
				<div className={classNames.sidebarSticky}>
					<ul className="nav flex-column">
						<li className="nav-item">
							<Link className="nav-link active" to="/">
								<span data-feather="home"/>
								Dashboard <span className="sr-only">(current)</span>
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/projects">
								<span data-feather="shopping-cart"/>
								Projects
							</Link>
						</li>
					</ul>

					{/*<h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>*/}
					{/*<span>Saved reports</span>*/}
					{/*<a className="d-flex align-items-center text-muted" href="#">*/}
					{/*<span data-feather="plus-circle"></span>*/}
					{/*</a>*/}
					{/*</h6>*/}
					{/*<ul className="nav flex-column mb-2">*/}
					{/*<li className="nav-item">*/}
					{/*<a className="nav-link" href="#">*/}
					{/*<span data-feather="file-text"></span>*/}
					{/*Current month*/}
					{/*</a>*/}
					{/*</li>*/}
					{/*<li className="nav-item">*/}
					{/*<a className="nav-link" href="#">*/}
					{/*<span data-feather="file-text"></span>*/}
					{/*Last quarter*/}
					{/*</a>*/}
					{/*</li>*/}
					{/*<li className="nav-item">*/}
					{/*<a className="nav-link" href="#">*/}
					{/*<span data-feather="file-text"></span>*/}
					{/*Social engagement*/}
					{/*</a>*/}
					{/*</li>*/}
					{/*<li className="nav-item">*/}
					{/*<a className="nav-link" href="#">*/}
					{/*<span data-feather="file-text"></span>*/}
					{/*Year-end sale*/}
					{/*</a>*/}
					{/*</li>*/}
					{/*</ul>*/}
				</div>
			</nav>
		);
	}
}

export default withStyle(Style)(ProjectNav);