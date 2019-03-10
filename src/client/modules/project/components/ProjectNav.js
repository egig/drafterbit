const React = require('react');
import { Link } from 'react-router-dom';
import Style from './ProjectNav.style';
import withStyle from '../../../withStyle';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import apiClient from '../../../apiClient';

class ProjectNav extends React.Component {

	constructor(props) {
		super(props)
		this.state  = {
			contentTypes: []
		}
	}

	componentDidMount() {
		let client = apiClient.createClient({});
		client.getContentTypes()
			.then((contentTypes) => {
				this.setState({
					contentTypes: contentTypes
				});
			});
	}

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

                    <h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>
                        <span><i className="icon-docs"/> Content</span>
                    </h6>
                    <ul className="nav flex-column mb-2">
                        {!this.state.contentTypes.length &&
                        <li className="nav-item">
                            <Link className="nav-link" to={`/content_types/new`}>
                                <i className="icon-plus"/> Add Content Type
                            </Link>
                        </li>
                        }

                        {this.state.contentTypes.map((ct, i) => {
                            return (
                                <li className="nav-item" key={i}>
                                    <Link className="nav-link" to={`/contents/${ct.slug}`}>
                                        <i className="icon-doc"/> {ct.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>
                        <span><i className="icon-equalizer"/> General</span>
                    </h6>
                    <ul className="nav flex-column mb-2">
                        <li className="nav-item">
                            <Link className="nav-link" to={`/content_types`}>
                                <i className="icon-puzzle"/> Content Types
                            </Link>
                        </li>
                        {/*<li className="nav-item">*/}
                            {/*<Link className="nav-link" to={`/settings`}>*/}
                                {/*<i className="icon-settings"/> Settings*/}
                            {/*</Link>*/}
                        {/*</li>*/}
                        <li className="nav-item">
                            <Link className="nav-link" to={`/api_keys`}>
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
        common: state.common
    };
};

export default withRouter(connect(mapStateToProps)(withStyle(Style)(ProjectNav)));