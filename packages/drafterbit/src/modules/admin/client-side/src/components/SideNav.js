import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import { Layout as BaseLayout, Menu } from 'antd';

import './SideNav.css';

const { Sider } = BaseLayout;
import {
    MonitorOutlined
} from '@ant-design/icons';

class SideNav extends React.Component {

    state = {
        menus: [{
            order: 0,
            icon: <MonitorOutlined/>,
            link: "/",
            label: "Dashboard",
        }]
    };

    componentDidMount() {

        const menuReducer = (accumulator, current) => {
            return accumulator.concat(current);
        };

        let menuPromises = [];
        this.props.$dt.modules.map((mo,i) => {
            if(typeof mo.getMenu == "function") {
                menuPromises.push(mo.getMenu());
            }
        });

        Promise.all(menuPromises)
            .then(moduleMenus => {
                let menus = moduleMenus.reduce(menuReducer, this.state.menus)
                    .sort((a,b) => {
                        let aOrder = (typeof a.order === 'undefined') ? 999 : a.order;
                        let bOrder = (typeof b.order === 'undefined') ? 999 : b.order;
                        return aOrder - bOrder;
                    });
                this.setState({
                    menus
                })
            })
    }

    render() {

        let settings = this.props.$dt.store.getState().COMMON.settings.General;
        let brandImgURL = settings.brand_img_url;
        let AppName = settings.app_name;

        return (
            <Sider style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                zIndex: 1000
            }} width={220} trigger={null} collapsible collapsed={this.props.collapsed}>
                <div className="logo" >
                    <Link to={"/"}><img alt={AppName} src={brandImgURL}/></Link>
                </div>
                <Menu theme="dark" selectable={true} mode="inline">
                    {this.state.menus.map((mn, i) => {
                        if(!!mn.children) {
                            return (
                                <Menu.SubMenu icon={mn.icon} key={i} title={mn.label}>
                                    {mn.children.map((mn, j) => (
                                        <Menu.Item key={i+"-"+j}><Link to={mn.link}>{mn.label}</Link></Menu.Item>
                                    ))
                                    }
                                </Menu.SubMenu>
                            )
                        }
                        return (
                            <Menu.Item icon={mn.icon}  key={i}><Link to={mn.link}>{mn.label}</Link></Menu.Item>
                        )
                    })}
                </Menu>
            </Sider>
        );
    }
}

export default withRouter(withDrafterbit(SideNav));