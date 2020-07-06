import React from 'react';
import { Layout as BaseLayout, Menu } from 'antd';
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
} from '@ant-design/icons';
import SideNav from './SideNav';
import { Helmet } from 'react-helmet';
import './Layout.css';

const { Header, Content, Footer } = BaseLayout;

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
				<Helmet>
					<title>{this.props.title}</title>
				</Helmet>
				<SideNav collapsed={this.state.collapsed} />
				<BaseLayout className="site-layout"  style={{ marginLeft: layoutMargin, minHeight: "100vh" }}>
					<Header className="site-layout-background" style={{
						padding: 0,
						display:'flex',
						justifyContent: "space-between", borderBottom: '1px solid #e1e1e1' }}>
						{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
							className: 'trigger',
							onClick: this.toggle,
						})}

						{this.props.$dt.modules.map((mo,i) => {
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