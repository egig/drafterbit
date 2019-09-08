import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withDrafterbit from '../../../withDrafterbit';
import { getContentTypes } from '../../content_type/actions';


import './SideNav.css';

class SideNav extends React.Component {

    constructor(props) {
        super(props);
        // this.state  = {
        //     contentTypes: []
        // };
    }

    componentDidMount() {

        let client = this.props.drafterbit.getApiClient();
        this.props.actions.getContentTypes(client);
            // .then((contentTypes) => {
            //     this.setState({
            //         contentTypes: contentTypes
            //     });
            // });
    }

    render() {

        return (
            <nav className={'col-md-2 d-none d-md-block bg-light sidebar'}>
                <div className="sidebarSticky">

                    <h6 className={'sidebarHeading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'}>
                        <span><i className="icon-docs"/> Content</span>
                    </h6>
                    <ul className="nav flex-column mb-2 side-menu">
                        {!this.props.contentTypes.length &&
                        <li className="nav-item">
                            <Link className="nav-link" to={'/content_types'}>
                                <i className="icon-plus"/> Add Content Type
                            </Link>
                        </li>
                        }

                        {this.props.contentTypes.map((ct, i) => {
                            return (
                                <li className="nav-item" key={i}>
                                    <Link className="nav-link" to={`/contents/${ct.slug}`}>
                                        <i className="icon-doc"/> {ct.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <h6 className={'sidebarHeading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'}>
                        <span><i className="icon-equalizer"/> General</span>
                    </h6>
                    <ul className="nav flex-column mb-2 side-menu">
	                    {/*<li className="nav-item">*/}
		                    {/*<Link className="nav-link" to={'/users'}>*/}
			                    {/*<i className="icon-user"/> Users*/}
		                    {/*</Link>*/}
                        {/*</li>*/}
                        <li className="nav-item">
                            <Link className="nav-link" to={'/content_types'}>
                                <i className="icon-puzzle"/> Content Types
                            </Link>
                        </li>
                        {/*<li className="nav-item">*/}
                        {/*<Link className="nav-link" to={`/settings`}>*/}
                        {/*<i className="icon-settings"/> Settings*/}
                        {/*</Link>*/}
                        {/*</li>*/}
                        <li className="nav-item">
                            <Link className="nav-link" to={'/api_keys'}>
                                <i className="icon-key"/> Api Keys
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={'/requests'}>
                                <i className="icon-puzzle"/> Requests
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
        contentTypes: state.CONTENT_TYPE.contentTypes
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            getContentTypes: getContentTypes
        }, dispatch)
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(SideNav)));