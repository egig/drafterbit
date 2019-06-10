import React from 'react';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import translate from '../../../translate';
import { withRouter } from 'react-router';
import LoaderTrap from '../../../components/LoaderTrap';
import { Container }from 'reactstrap';
import SideNav from './SideNav';
import TopNav from './TopNav';
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
	              <TopNav/>
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