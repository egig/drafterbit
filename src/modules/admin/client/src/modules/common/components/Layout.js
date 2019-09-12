import React from 'react';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import translate from '../../../translate';
import { withRouter } from 'react-router';
import LoaderTrap from '../../../components/LoaderTrap';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink, Badge,
    NavbarToggler, Collapse,
    UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu} from 'reactstrap';
import SideNav from './SideNav';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { setCookie } from '../../../cookie';
import Notify from '../../../components/Notify';

import './Layout.css';

class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
			fq: [],
			notifyText: ""
        };
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		if(nextProps.notifyText !== "") {
			this.setState({
				notifyText: nextProps.notifyText
			})
		}
	}

    render() {

        return (
            <span>
	            <Helmet>
		            <title>{this.props.title} - Drafterbit</title>
	            </Helmet>
	            <Navbar color="dark" dark sticky="top" className="flex-md-nowrap p-0" expand="md">
		            <NavbarBrand className={'layout-navbarBrand col-sm-3 col-md-2 mr-0'}>
			            <img  className="layout-navbarBrandImg" src="/assets/img/dtlogo3-light.png" alt="drafterbit"/>
						<small className="layout-versionBadge">alpha</small>
		            </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                     <Collapse isOpen={false} navbar>
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
		            <Nav navbar className="px-3 ml-auto">
		              {/*<NavItem className="text-nowrap">*/}
                           {/*<NavLink onClick={e => {*/}
		                    {/*e.preventDefault();*/}
		                {/*}}>{this.props.user.name}</NavLink>*/}
                      {/*</NavItem>*/}
		              {/*<NavItem className="text-nowrap">*/}

		                {/*<NavLink onClick={e => {*/}
		                    {/*e.preventDefault();*/}
		                    {/*setCookie('dt_auth_token', '');*/}
		                    {/*window.location.replace('/');*/}
		                {/*}} href="/logout">Logout</NavLink>*/}
		              {/*</NavItem>*/}

                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                              <img className="layout-avatar-img" src="/assets/img/default-avatar.png" />
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem>
                                  <Link to={'/my-profile'}>
                                      My Profile
                                  </Link>
                              </DropdownItem>
                              <DropdownItem divider />
                              <DropdownItem>
                                <a onClick={e => {
                                    e.preventDefault();
                                    setCookie('dt_auth_token', '');
                                    window.location.replace('/');
                                }} href="/logout">Logout</a>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
		            </Nav>
                     </Collapse>
	            </Navbar>
                <Container fluid>
	                <SideNav />
	                <main role="main" className={'col-md-9 ml-sm-auto col-lg-10 pt-3'}>
                        {this.props.children}
	                </main>
                </Container>
                {this.props.isAjaxLoading &&
                    <LoaderTrap />
				}
				{/* {this.state.notifyText &&
                    <Notify type="success" message={this.state.notifyText} onTimeout={() => {
						console.log("NOTIFY TIMEOUT");
						this.setState({
							notifyText: ""
						})
					}} />
                } */}
            </span>
        );
    }
}

Layout.defaultProps = {
    title: 'Untitled Page'
};

const mapStateToProps = (state) => {
    return {
        user: state.USER.currentUser,
		isAjaxLoading: state.COMMON.isAjaxLoading,
		notifyText: state.COMMON.notifyText
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};


export default translate(['translation'])(withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Layout))
);