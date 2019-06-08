import React from 'react';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import translate from '../../../translate';
import { withRouter } from 'react-router';
import LoaderTrap from '../../../components/LoaderTrap';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink, Badge} from 'reactstrap';
import SideNav from './SideNav';
import { Helmet } from 'react-helmet';

import './Layout.css';

class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            fq: []
        };
    }

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