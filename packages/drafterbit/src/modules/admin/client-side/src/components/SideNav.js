// import React, {Fragment} from 'react';
// import { Link } from 'react-router-dom';
// import { withRouter } from 'react-router';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
//
//
// import './SideNav.css';
//
// class SideNav extends React.Component {
//
//     renderMenuItems(menuItems) {
//         return menuItems.map((mn,i) => {
//             return (
//                 <li className="nav-item" key={i}>
//                     <Link className="nav-link" to={mn.link}>
//                         <i className={mn.iconClass}/> {mn.label}
//                     </Link>
//                 </li>
//             )
//         });
//     }
//
//     render() {
//
//         return (
//             <nav className={'col-md-2 d-none d-md-block bg-light sidebar'}>
//                 <div className="sidebarSticky">
//                     {this.props.drafterbit.modules.map((mo,i) => {
//                         if(typeof mo.renderMenuSection == "function") {
//                             return mo.renderMenuSection(i);
//                         }
//                     })}
//
//                     <h6 className={'sidebarHeading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'}>
//                         <span><i className="icon-equalizer"/> General</span>
//                     </h6>
//                     <ul className="nav flex-column mb-2 side-menu">
//                     {this.props.drafterbit.modules.map(mo => {
//                         if (!!mo.generalMenus && !!mo.generalMenus.length) {
//                             return mo.generalMenus.map((mn,i) => {
//                                 return (
//                                     <li className="nav-item" key={i}>
//                                         <Link className="nav-link" to={mn.link}>
//                                             <i className={mn.iconClass}/> {mn.label}
//                                         </Link>
//                                     </li>
//                                 )
//                             });
//                         }
//                     })}
//                     </ul>
//                 </div>
//             </nav>
//         );
//     }
// }
//
// const mapStateToProps = (state) => {
//     return {
//         contentTypes: state.CONTENT.contentTypes
//     };
// };
//
// const mapDispatchToProps = (dispatch) => {
//     return {
//         // actions: bindActionCreators({
//         //     getContentTypes: getContentTypes
//         // }, dispatch)
//     }
// };
//
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(SideNav)));

import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';


import './SideNav.css';

import { Layout as BaseLayout, Menu } from 'antd';

const { Sider } = BaseLayout;
const { SubMenu } = Menu;

class SideNav extends React.Component {

    render() {

        let brandImgURL = this.props.drafterbit.store.getState().COMMON.settings.General.brand_img_url;

        return (
            <Sider style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                zIndex: 1000
            }} width={220} trigger={null} collapsible collapsed={this.props.collapsed}>
                <div className="logo" >
                    <img src={brandImgURL}/>
                </div>
                {/*<Link to={"/"}><h1 className="layout-navbarBrandImg">{this.props.drafterbit.getConfig("appName")}</h1></Link>*/}
                {this.props.drafterbit.modules.map((mo,i) => {
                    if(typeof mo.renderMenuSection == "function") {
                        return mo.renderMenuSection(i);
                    }
                })}
                <Menu theme="dark" selectable={false} mode="inline">
                    {this.props.drafterbit.modules.map((mo, i) => {
                        if (!!mo.generalMenus && !!mo.generalMenus.length) {
                            return mo.generalMenus.map((mn,j) => {
                                return (
                                    <Menu.Item icon={mn.icon}  key={i+"-"+j}><Link to={mn.link}>{mn.label}</Link></Menu.Item>
                                )
                            });
                        }
                    })}
                </Menu>
            </Sider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        contentTypes: state.CONTENT.contentTypes
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // actions: bindActionCreators({
        //     getContentTypes: getContentTypes
        // }, dispatch)
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(SideNav)));