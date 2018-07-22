import React from 'react';
import { Link } from 'react-router-dom';
import Style from './ContentManagerNav.style';
import withStyle from '../../../../withStyle';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

class ContentManagerNav extends React.Component {
    render() {

        let { classNames, match } = this.props;

        return (
            <nav className={`col-md-2 d-none d-md-block bg-light ${classNames.sidebar}`}>
                <div className={classNames.sidebarSticky}>

                    <ul className="nav flex-column mb-2">
                        <li className="nav-item">
                            <Link className="nav-link" to={`/project/${this.props.project.id}/contents`}>
                                <i className="icon-dashboard"/> Dashboard
                            </Link>
                        </li>

                        {!this.props.project.content_types.length &&
							<li className="nav-item">
							    <Link className="nav-link" to={`/project/${this.props.project.id}/content_types/new`}>
							        <i className="icon-plus"/> Add Content Type
							    </Link>
							</li>
                        }

                        {this.props.project.content_types.map((ct, i) => {
                            return (
                                <li className="nav-item" key={i}>
                                    <Link className="nav-link" to={`/project/${this.props.project.id}/contents/${ct.slug}`}>
                                        <i className="icon-doc"/> {ct.name}
                                    </Link>
                                </li>
                            );
                        })}
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

export default withRouter(connect(mapStateToProps)(withStyle(Style)(ContentManagerNav)));