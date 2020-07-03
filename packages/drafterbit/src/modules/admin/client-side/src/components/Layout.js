// import React from 'react';
// import actions from '../actions';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import translate from '../../../translate';
// import LoaderTrap from '@drafterbit/common/client-side/components/LoaderTrap';
// import { Container, Navbar, NavbarBrand, Nav, NavbarToggler, Collapse } from 'reactstrap';
import SideNav from './SideNav';
// import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
// import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
//
import './Layout.css';
//
// class Layout extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             q: '',
// 			fq: [],
// 			notifyText: ""
//         };
// 	}
//
// 	UNSAFE_componentWillReceiveProps(nextProps) {
// 		if(nextProps.notifyText !== "") {
// 			this.setState({
// 				notifyText: nextProps.notifyText
// 			})
// 		}
// 	}
//
//     render() {
//
//         return (
//             <span>
// 	            <Helmet>
// 		            <title>{this.props.title} - {this.props.drafterbit.getConfig("appName")}</title>
// 	            </Helmet>
// 	            <Navbar color="dark" dark sticky="top" className="flex-md-nowrap p-0" expand="md">
// 		            <NavbarBrand tag="span" className={'layout-navbarBrand col-sm-3 col-md-2 mr-0'}>
// 			            {/*TODO support brand image*/}
// 			            {/*<img  className="layout-navbarBrandImg" src="/img/dtlogo3-light.png" alt="drafterbit"/>*/}
// 						<Link to={"/"}><h1 className="layout-navbarBrandImg">{this.props.drafterbit.getConfig("appName")}</h1></Link>
// 		            </NavbarBrand>
//                     <NavbarToggler onClick={this.toggle} />
//                      <Collapse isOpen={false} navbar>
// 		            <Nav navbar className="px-3 ml-auto">
//
//                         {this.props.drafterbit.modules.map((mo,i) => {
//                             if(typeof mo.renderNavBarMenu == "function") {
//                                 return mo.renderNavBarMenu(i);
//                             }
//                         })}
//
// 		            </Nav>
//                      </Collapse>
// 	            </Navbar>
//                 <Container fluid>
// 	                <SideNav />
// 	                <main role="main" className={'col-md-9 ml-sm-auto col-lg-10 pt-3'}>
//                         {this.props.children}
// 	                </main>
//                 </Container>
//                 {this.props.isAjaxLoading &&
//                     <LoaderTrap />
// 				}
//             </span>
//         );
//     }
// }
//
// Layout.defaultProps = {
//     title: 'Untitled Page'
// };
//
// const mapStateToProps = (state) => {
//     return {
//         user: {},//state.USER.currentUser,
// 		isAjaxLoading: state.COMMON.isAjaxLoading,
// 		notifyText: state.COMMON.notifyText
//     };
// };
//
// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators(actions, dispatch);
// };
//
//
// export default translate(['translation'])(
//     connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(Layout)));

import React from 'react';
import { Layout as BaseLayout, Menu } from 'antd';
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = BaseLayout;
const { SubMenu } = Menu;

class Layout extends React.Component {
	state = {
		collapsed: false,
	};

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};

	render() {
		let layoutMargin = this.state.collapsed ? 80 : 220;
		return (
			<BaseLayout>
				<SideNav collapsed={this.state.collapsed} />
				<BaseLayout className="site-layout"  style={{ marginLeft: layoutMargin, minHeight: "100vh", backgroundColor: "#FFF" }}>
					<Header className="site-layout-background" style={{
						padding: 0,
						display:'flex',
						justifyContent: "space-between", borderBottom: '1px solid #e1e1e1' }}>
						{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
							className: 'trigger',
							onClick: this.toggle,
						})}

						{this.props.drafterbit.modules.map((mo,i) => {
							if(typeof mo.renderNavBarMenu == "function") {
								return mo.renderNavBarMenu(i);
							}
						})}
					</Header>
					<Content
						// className="site-layout-background"
						style={{ margin: '24px 16px 0', overflow: 'initial'}}
					>
						{this.props.children}
					</Content>
					<Footer style={{ textAlign: 'center' }}>Thank you for building with us</Footer>
				</BaseLayout>
			</BaseLayout>
		);
	}
}

export default Layout;