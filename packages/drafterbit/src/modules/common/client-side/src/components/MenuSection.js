import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
    MonitorOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';

class MenuSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contentTypes: []
        }
    }

    render() {
        return (
            <Menu theme="dark" selectable={false} mode="inline">
                <Menu.Item icon={<MonitorOutlined />} key="item-group-dashboard-home"><Link to="/">Dashboard</Link></Menu.Item>
            </Menu>
        )
    }
}

export default MenuSection