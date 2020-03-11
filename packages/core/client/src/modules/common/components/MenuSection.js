import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

class MenuSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contentTypes: []
        }
    }

    render() {

        // TODO componentize the menu section and menu item, it render same accross module
        return (
            <Fragment>
                <h6 className={'sidebarHeading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'}>
                    <span><i className="icon-grid"/> Dashboard</span>
                </h6>
                <ul className="nav flex-column mb-2 side-menu">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">
                            <i className="icon-home"/> Home
                        </Link>
                    </li>
                </ul>
            </Fragment>
        )
    }
}

export default MenuSection