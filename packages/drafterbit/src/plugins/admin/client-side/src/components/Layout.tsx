import React from 'react';
import { Layout as BaseLayout, Menu } from 'antd';
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
} from '@ant-design/icons';
import SideNav from './SideNav';
import './Layout.css';
import ClientSide from "../ClientSide";
import Module from "../Module";

const { Header, Content, Footer } = BaseLayout;

type Props = {
	$dt: ClientSide
}

type State = {
	collapsed: boolean
}

class Layout extends React.Component<Props, State> {

	state = {
		collapsed: false,
	};

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};

	render() {

		let navProps: SideNav.Props = {
			collapsed: this.state.collapsed,
			$dt: this.props.$dt
		};

		let layoutMargin = this.state.collapsed ? 80 : 220;
		return (
			<BaseLayout>
				<SideNav {...navProps} />
				<BaseLayout className="site-layout"  style={{ marginLeft: layoutMargin, minHeight: "100vh" }}>
					<Header className="site-layout-background" style={{
						padding: 0,
						display:'flex',
						justifyContent: "space-between",
						borderBottom: '1px solid #e1e1e1'
					}}>
						{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
							className: 'trigger',
							onClick: this.toggle,
						})}

						{this.props.$dt.modules.map((mo: Module,i: any) => {
							return mo.renderNavBarMenu(i);
						})}
					</Header>
					<Content
						style={{overflow: 'initial'}}
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