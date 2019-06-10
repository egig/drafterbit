import React from 'react';
import {Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink} from 'reactstrap';

import  './TopNav.css'

class TopNav extends React.Component {

	render() {
		return (
			<Navbar color="dark" dark sticky="top" className="flex-md-nowrap p-0">
				<NavbarBrand className={'layout-navbarBrand col-sm-3 col-md-2 mr-0'}>
					<img  className="layout-navbarBrandImg" src="/img/dtlogo57-light.png" alt="drafterbit"/>
				</NavbarBrand>
				<NavbarToggler className="d-block .d-sm-none" onClick={this.toggle} />
				{/*<div className="layout-search-widget">*/}
				{/*/!*<Badge className="m-2 h-100">Content Type: Book</Badge>*!/*/}
				{/*{this.state.q &&*/}
				{/*<Badge className="m-2 h-100">q: {this.state.q}</Badge>*/}
				{/*}*/}
				{/*{this.state.fq.map(r => {*/}
				{/*return <Badge className="m-2 h-100">{r}</Badge>*/}
				{/*})*/}
				{/*}*/}
				{/*<input onKeyUp={e => {*/}

				{/*if(e.keyCode == 8 && e.target.value == "") {*/}
				{/*this.setState({*/}
				{/*q: ""*/}
				{/*});*/}
				{/*}*/}

				{/*// ENTER*/}
				{/*if(e.keyCode == 13) {*/}

				{/*if (e.target.value.indexOf(":") > 0 ) {*/}
				{/*this.setState({*/}
				{/*fq: this.state.fq.concat([e.target.value])*/}
				{/*})*/}
				{/*} else {*/}
				{/*this.setState({*/}
				{/*q: e.target.value*/}
				{/*});*/}
				{/*}*/}
				{/*e.target.value = '';*/}
				{/*}*/}

				{/*}} className="form-control layout-form-control-dark" type="text" placeholder="Search" aria-label="Search" />*/}
				{/*/!*{this.state.q &&*!/*/}
				{/*/!*<div className="layout-search-suggestion-box">*!/*/}
				{/*/!*{this.state.q}*!/*/}
				{/*/!*</div>*!/*/}
				{/*/!*}*!/*/}
				{/*</div>*/}
				<Nav navbar className="px-3">
					<NavItem className="text-nowrap">
						<NavLink href="/logout">Logout</NavLink>
					</NavItem>
				</Nav>
			</Navbar>
		)
	}
}

export default TopNav;