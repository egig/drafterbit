// @ts-ignore
import {setCookie} from '@drafterbit/common/dist/client-side/cookie';
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
            setCookie('dt_auth_token', '', 2)
            window.location.replace('/')
        }}>Logout</span></Menu.Item>
    </Menu>
);

class NavBarMenu extends React.Component {
    render() {
        return (
            <Dropdown overlay={menu}>
                <img style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    margin: '16px',
                    cursor: 'pointer'
                }} alt="avatar" className="layout-avatar-img" src={"/img/default-avatar.png"} />
            </Dropdown>

        );
    }
}

export default NavBarMenu;