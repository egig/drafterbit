import React from 'react';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import translate from '../../../translate';
import { withRouter } from 'react-router';
import LoaderTrap from '../../../components/LoaderTrap';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
import SideNav from './SideNav';
import { Helmet } from 'react-helmet';

import './Layout.css';

class Layout extends React.Component {

    render() {

        return (
            <span>
	            <Helmet>
		            <title>{this.props.title} - Drafterbit</title>
	            </Helmet>
	            <Navbar color="dark" dark sticky="top" className="flex-md-nowrap p-0">
		            <NavbarBrand className={'layout-navbarBrand col-sm-3 col-md-2 mr-0'}>
                        <img  className="layout-navbarBrandImg" src="/img/dtlogo57-light.png" alt="drafterbit"/>
		            </NavbarBrand>
		            <Nav navbar className="px-3">
		              <NavItem className="text-nowrap">
		                <NavLink href="/logout">Logout</NavLink>
		              </NavItem>
		            </Nav>
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
        isAjaxLoading: state.COMMON.isAjaxLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};


export default translate(['translation'])(withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Layout))
);