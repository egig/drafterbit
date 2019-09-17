import React, { Fragment } from 'react';
import withDrafterbit from 'drafterbit-module-admin/client/src/withDrafterbit';
import { Link } from 'react-router-dom';

class MenuSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contentTypes: []
        }
    }

    componentDidMount() {
        // TODO changes this to store redux state
        let client = this.props.drafterbit.getApiClient();
        client.getContentTypes()
            .then((contentTypes) => {
                this.setState({
                    contentTypes: contentTypes
                });
            });
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

        let { contentTypes } =  this.state;
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

export default withDrafterbit(MenuSection)