import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {Link} from 'react-router-dom';
import {setCookie} from '../../../../core/client/src/cookie';
import React from 'react';
import {Menu, Dropdown} from 'antd';

import {
    LogoutOutlined
} from '@ant-design/icons';


// TODO make logout right
const menu = (
    <Menu>
        <Menu.Item icon={<LogoutOutlined/>} key="1"><span onClick={e => {
            e.preventDefault();
            setCookie('dt_auth_token', '')
            window.location.replace('/')
        }}>Logout</span></Menu.Item>
    </Menu>
);

class NavBarMenu extends React.Component {
    render() {
        return (
            <Dropdown overlay={menu}>
                <img style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    margin: '14px',
                    cursor: 'pointer'
                }} alt="avatar" className="layout-avatar-img" src={"/img/default-avatar.png"} />
            </Dropdown>

        );
    }
}

export default NavBarMenu;