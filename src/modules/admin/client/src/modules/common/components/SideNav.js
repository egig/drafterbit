import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withDrafterbit from '../../../withDrafterbit';


import './SideNav.css';

class SideNav extends React.Component {

    renderMenuItems(menuItems) {
        return menuItems.map((mn,i) => {
            return (
                <li className="nav-item" key={i}>
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
                        if(typeof mo.renderMenuSection == "function") {
                            return mo.renderMenuSection('/admin');
                        }
                    })}

                    <h6 className={'sidebarHeading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'}>
                        <span><i className="icon-equalizer"/> General</span>
                    </h6>
                    <ul className="nav flex-column mb-2 side-menu">
                    {this.props.drafterbit.modules.map(mo => {
                        return mo.generalMenus.map((mn,i) => {
                            return (
                                <li className="nav-item" key={i}>
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
        // actions: bindActionCreators({
        //     getContentTypes: getContentTypes
        // }, dispatch)
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(SideNav)));