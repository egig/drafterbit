import React, { Fragment } from 'react';
import withDrafterbit from '../../../../core/client/src/withDrafterbit';
import { Link } from 'react-router-dom';
import { connect } from "react-redux"
import actions from '../actions'
import { bindActionCreators } from 'redux';
import ApiClient from '../ApiClient';

class MenuSection extends React.Component {

    componentDidMount() {
        // TODO changes this to store redux state
        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
        client.getContentTypes()
            .then((contentTypes) => {
                // Display only non-system collection
                contentTypes = contentTypes.filter(c => !c.system);
                this.props.actions.setContentTypes(contentTypes);
            });
    }

    renderMenuItems(menuItems) {
        return menuItems.map((mn, i) => {
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

        let { contentTypes } =  this.props;
        let menuItems = contentTypes.map(ct => {
            return {
                link: `/contents/${ct.slug}`,
                label: ct.name,
                iconClass: "icon-doc"
            }
        });

        // TODO componentize the menu section and menu item, it render same accross module
        return (
            <Fragment>
                <h6 className={'sidebarHeading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'}>
                    <span><i className="icon-docs"/> Contents</span>
                </h6>
                <ul className="nav flex-column mb-2 side-menu">
                    {this.renderMenuItems(menuItems)}
                </ul>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        contentTypes: state.CONTENT.contentTypes
    }
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(MenuSection))