const React = require('react');
import withStyle from '../../../withStyle';
import Style from './Layout.style';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import translate from '../../../translate';
import { withRouter } from 'react-router';
import LoaderTrap from '../../../components/LoaderTrap';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';

class Layout extends React.Component {

    // componentDidMount() {
    //     this.props.getProjects(this.props.user.id);
    // }
    //
    // onProjectChange(select) {
    //     if(select.value != 0) {
    //         this.props.history.push(`/project/${select.value}`);
    //     }
    // }

    render() {

        let { classNames, projects, t } = this.props;

        return (
            <span>
	            <Navbar color="dark" dark sticky="top" className="flex-md-nowrap p-0">
		            <NavbarBrand className={`${classNames.navbarBrand} col-sm-3 col-md-2 mr-0`}>
                    <img  className={classNames.navbarBrandImg} src="/img/dtlogo57-light.png" alt="drafterbit"/>
		            </NavbarBrand>
		            <Nav navbar className="px-3">
		              <NavItem className="text-nowrap">
		                <NavLink href="/logout">Logout</NavLink>
		              </NavItem>
		            </Nav>
	            </Navbar>
                <Container fluid>
                    {this.props.children}
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
        user: state.user.currentUser,
        isAjaxLoading: state.common.isAjaxLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};


export default translate(['translation'])(withRouter(withStyle(Style)(
    connect(mapStateToProps, mapDispatchToProps)(Layout))));