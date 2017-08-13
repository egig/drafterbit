import React from 'react';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import Avatar from 'react-md/lib/Avatars';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const HeaderActions = function () {

	return (
		<div style={{
			marginTop: '12px'
		}}>
			<div style={{
				float: 'left',
				display: 'block',
				marginTop: '8px',
				marginRight: '15px',
				fontSize: '18px'
			}}>John Doe</div>
			<Avatar>0</Avatar>
		</div>
	)
};
const HeaderTitle = function () {
	return (
		<span>
			<img style={{
				height: '40px',
				marginTop: '10px',
				marginLeft: '20px'
			}} src="/img/dinas_pu.png" />
			<span style={{
				position: 'relative',
				left: '10px',
				fontSize: '24px',
				bottom: '10px'
			}}>eTGR - Aplikasi Penatausahaan Piutang TGR</span>
		</span>
	)
};

const {
	CLIPPED
} = NavigationDrawer.DrawerTypes;

const navItemsView = function(history, tipeUser) {

	let navItems = [
		{ order: 1,  primaryText: 'Dashboard', leftIcon:<FontIcon>home</FontIcon>, link: '/secure/system/dashboard'},
		{ order: 2, primaryText: 'TGR', leftIcon:<FontIcon>book</FontIcon>, link: '/secure/tgr'},
		{ order: 3, primaryText: 'Bantuan', leftIcon:<FontIcon>help_outline</FontIcon>, link: '/secure/help'},
		{ order: 5, primaryText: 'Keluar', leftIcon:<FontIcon>power_settings_new</FontIcon>, link: '/logout'}
	];

	if(tipeUser == 1) {
		navItems = navItems.concat([
			{ order: 4, primaryText: 'Pengguna', leftIcon:<FontIcon>account_circle</FontIcon>, link: '/secure/users'}
		])
	}
	
	navItems.sort(function (a, b) {
		return a.order - b.order;
	});

	return navItems.map(function (item, i) {

		return {
			leftIcon: item.leftIcon,
			primaryText: item.primaryText,
			onClick:function () {

				// TODO don't harcode logout here
				if(/logout/.test(item.link)) {
					window.location.replace(item.link);
					return;
				}

				history.push(item.link)
			}
		};
	});
};


let MainLayout = function MainLayout(props) {

	let drawerTitle = 'BIRO KEUANGAN';

	if(parseInt(props.currentUser.tipeUserId) === 2) {
		drawerTitle = 'ESELON';
	}

	if(parseInt(props.currentUser.tipeUserId) === 3) {
		drawerTitle = 'SATUAN KERJA';
	}

	return (
		<NavigationDrawer
			defaultVisible={true}
			drawerTitle={drawerTitle}
			desktopDrawerType={CLIPPED}
			navItems={navItemsView(props.history, props.currentUser.tipeUserId)}
			toolbarTitle={<HeaderTitle />}
			// 			toolbarActions={<HeaderActions />} TODO
		>
			{props.children}
		</NavigationDrawer>
	)
};

const mapStateToProps = function mapStateToProps(state) {
	return {
		currentUser: state.user.currentUser
	}
};

MainLayout = withRouter(connect(mapStateToProps)(MainLayout));

export default MainLayout;