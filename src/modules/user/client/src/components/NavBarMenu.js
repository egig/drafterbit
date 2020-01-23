import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {Link} from 'react-router-dom';
import {setCookie} from '../../../../core/client/src/cookie';
import React from 'react';

class NavBarMenu extends React.Component {
    render() {
        return (<UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                <img alt="avatar" className="layout-avatar-img" src={"/img/default-avatar.png"} />
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem>
                    <Link to={'/my-profile'}>
                        My Profile
                    </Link>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                    <a onClick={e => {
                        e.preventDefault();
                        setCookie('dt_auth_token', '');
                        window.location.replace('/');
                    }} href="/logout">Logout</a>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>)
    }
}

export default NavBarMenu;