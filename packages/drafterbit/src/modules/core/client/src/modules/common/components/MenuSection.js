import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
    HomeOutlined
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
                <Menu.Item icon={<HomeOutlined />} key="item-group-dashboard-home"><Link to="/">Home</Link></Menu.Item>
            </Menu>
        )
    }
}

export default MenuSection