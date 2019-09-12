import React, {Fragment} from 'react';
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

    renderMenuItems(menuItems) {
        return menuItems.map(mn => {
            return (
                <li className="nav-item">
                    <Link className="nav-link" to={mn.link}>
                        <i className={mn.iconClass}/> {mn.label}
                    </Link>
                </li>
            )
        }); 
    }

    render() {

        return (
            <nav className={'col-md-2 d-none d-md-block bg-light sidebar'}>
                <div className="sidebarSticky">
                    {this.props.drafterbit.modules.map(mo => {
                        if(typeof mo.getMenuSection == "function") {
                            let ms = mo.getMenuSection()
                            return (
                                <Fragment>
                                    <h6 className={'sidebarHeading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'}>
                                        <span><i className={ms.iconClass}/> {ms.label}</span>
                                    </h6>
                                    <ul className="nav flex-column mb-2 side-menu">
                                        {this.renderMenuItems(ms.menuItems)}
                                    </ul>
                                </Fragment>
                            )
                        }
                    })}

                    <h6 className={'sidebarHeading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'}>
                        <span><i className="icon-equalizer"/> General</span>
                    </h6>
                    <ul className="nav flex-column mb-2 side-menu">
                    {this.props.drafterbit.modules.map(mo => {
                        return mo.generalMenus.map(mn => {
                            return (
                                <li className="nav-item">
                                    <Link className="nav-link" to={mn.link}>
                                        <i className={mn.iconClass}/> {mn.label}
                                    </Link>
                                </li>
                            )
                        });
                    })}
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