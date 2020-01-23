import React from 'react';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import translate from '../../../translate';
import LoaderTrap from '../../../components/LoaderTrap';
import { Container, Navbar, NavbarBrand, Nav, NavbarToggler, Collapse } from 'reactstrap';
import SideNav from './SideNav';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import withDrafterbit from '../../../withDrafterbit';

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
		            <NavbarBrand tag="span" className={'layout-navbarBrand col-sm-3 col-md-2 mr-0'}>
			            {/*TODO support brand image*/}
			            {/*<img  className="layout-navbarBrandImg" src="/img/dtlogo3-light.png" alt="drafterbit"/>*/}
						<Link to={"/"}><h1 className="layout-navbarBrandImg">{this.props.drafterbit.getConfig("appName")}</h1></Link>
		            </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                     <Collapse isOpen={false} navbar>
		            <Nav navbar className="px-3 ml-auto">

                        {this.props.drafterbit.modules.map((mo,i) => {
                            if(typeof mo.renderNavBarMenu == "function") {
                                return mo.renderNavBarMenu(i);
                            }
                        })}

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
            </span>
        );
    }
}

Layout.defaultProps = {
    title: 'Untitled Page'
};

const mapStateToProps = (state) => {
    return {
        user: {},//state.USER.currentUser,
		isAjaxLoading: state.COMMON.isAjaxLoading,
		notifyText: state.COMMON.notifyText
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};


export default translate(['translation'])(
    connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(Layout)));