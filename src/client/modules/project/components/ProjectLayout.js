const React = require('react');
import Layout from '../../common/components/Layout';
import ProjectNav from './ProjectNav';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class ProjectLayout extends React.Component {

    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.match.params.project_id !== this.props.match.params.project_id) {
    //         this.props.getProject(nextProps.match.params.project_id);
    //     }
    // }
    //
    // componentDidMount(){
    //     //TODO check if this is server-preloaded
    //     this.props.getProject(this.props.match.params.project_id);
    // }

    render() {

        return (
            <Layout title={this.props.title}>
                <ProjectNav />
                <main role="main" className={'col-md-9 ml-sm-auto col-lg-10 pt-3'}>
                    {this.props.children}
                </main>
            </Layout>
        );
    }
}

Layout.defaultProps = {
    title: 'Untitled Page'
};

const mapStateToProps = (state) => {
    return {
        common: state.common
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectLayout));