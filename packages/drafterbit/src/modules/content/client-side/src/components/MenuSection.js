import React, { Fragment } from 'react';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import { Link } from 'react-router-dom';
import { connect } from "react-redux"
import actions from '../actions'
import { bindActionCreators } from 'redux';
import ApiClient from '../ApiClient';
import {Menu} from 'antd';

import {
    FileTextOutlined
} from '@ant-design/icons';

class MenuSection extends React.Component {

    componentDidMount() {
        // TODO changes this to store redux state
        let client = this.props.drafterbit.getApiClient();
        client.getContentTypes()
            .then((contentTypes) => {
                // Display only non-system collection
                contentTypes = contentTypes.filter(c => !c.system);
                this.props.actions.setContentTypes(contentTypes);
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
            <Menu theme="dark" selectable={false} mode="inline">
                <Menu.SubMenu icon={<FileTextOutlined />}  key="sub-menu-contents" title="Contents">
                    {menuItems.map((mn, i) => {
                        return (
                            <Menu.Item key={i}><Link to={mn.link}>{mn.label}</Link></Menu.Item>
                        )
                    })
                    }
                </Menu.SubMenu>
            </Menu>
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