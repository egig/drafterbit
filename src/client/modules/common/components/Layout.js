const React = require('react');
import withStyle from '../../../withStyle';
import Style from './Layout.style';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import translate from '../../../translate';
import { withRouter } from 'react-router';
import LoaderTrap from '../../../components/LoaderTrap';

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
                <nav className={`${classNames.navbar} navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0`}>
                    <a className={`${classNames.navbarBrand} navbar-brand col-sm-3 col-md-2 mr-0`} href="/">
                        <img  className={classNames.navbarBrandImg} src="/img/dtlogo57-light.png" alt="drafterbit"/>
                    </a>
                    {/*<form className={classNames.navbarForm}>*/}
                        {/*<select onChange={(e) => {*/}
                            {/*this.onProjectChange(e.target);*/}
                        {/*}} className={classNames.navbarProjectSelector} value={this.props.project._id}>*/}
                            {/*<option value={0}>{t('layout.select_project')}</option>*/}
                            {/*{projects.map((p,i) => {*/}
                                {/*return (<option key={i} value={p._id}>{p.name}</option>);*/}
                            {/*})}*/}
                        {/*</select>*/}
                    {/*</form>*/}
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap">
                            <a className="nav-link" href="/logout">Logout</a>
                        </li>
                    </ul>
                </nav>
                <div className="container-fluid">
                    {this.props.children}
                </div>
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