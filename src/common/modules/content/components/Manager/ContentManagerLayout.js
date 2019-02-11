const React = require('react');
import withStyle from '../../../../withStyle';
import Style from './ContentManagerLayout.style';
import actions from '../../../project/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import translate from '../../../../../translate';
import { withRouter } from 'react-router';
import LoaderTrap from '../../../../components/LoaderTrap';
import ContentManagerNav from './ContentManagerNav';

class ContentManagerLayout extends React.Component {

    componentDidMount() {
        this.props.getProject(this.props.match.params.project_id);
    }

    onProjectChange(select) {
        if(select.value != 0) {
            this.props.history.push(`/project/${select.value}`);
        }
    }

    render() {

        let { classNames, projects, t } = this.props;

        return (
            <span>
                <nav className={`${classNames.navbar} navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0`}>
		      <a className={`${classNames.navbarBrand} navbar-brand col-sm-3 col-md-2 mr-0`} href={`/project/${this.props.project._id}/contents`}>
			      {this.props.project.name}
		      </a>
                    <ul className="navbar-nav px-3">
		        <li className="nav-item text-nowrap">
		          <a className="nav-link" href="/logout">Logout</a>
		        </li>
		      </ul>
		    </nav>
                <div className="container-fluid">
                    <ContentManagerNav />
                    <main role="main" className={'col-md-9 ml-sm-auto col-lg-10 pt-3'}>
                        {this.props.children}
                    </main>
		    </div>
                {this.props.isAjaxLoading &&
				<LoaderTrap />
                }
            </span>
        );
    }
}

ContentManagerLayout.defaultProps = {
    title: 'Untitled Page'
};

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser,
        project: state.project.project,
        isAjaxLoading: state.common.isAjaxLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};


export default translate(['translation'])(withRouter(withStyle(Style)(
    connect(mapStateToProps, mapDispatchToProps)(ContentManagerLayout))));