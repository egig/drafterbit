import React from 'react';
import Layout from '../../common/components/Layout';
import translate from '../../../../translate';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Card from '../../../components/Card/Card';

class NewProject extends React.Component {

    doSubmit(form) {
        this.props.createProject(
            form.project_name.value,
            form.project_description.value,
            this.props.user.id
        ).then(r => {
            this.props.history.push('/');
        });
    }

    render() {
        const { t } = this.props;
        return (
            <Layout title={t('project:layout_title_new')}>
                <div className="row justify-content-md-center mt-4">
                    <div className="col col-md-6">
                        <Card headerText="Crate New Project">
                            <form onSubmit={e => { e.preventDefault(); this.doSubmit(e.target); }}>
                                <div className="form-group">
                                    <label htmlFor="project_name">{t('project:new_form.project_name')}</label>
                                    <input type="text" id="project_name" name="project_name" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="project_description">Description</label>
                                    <textarea id="project_description" name="project_description" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">{t('project:new_form.create')}</button>
                                    <Link to="/" className="btn btn-link ml-1">{t('project:new_form.cancel')}</Link>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default translate(['project'])(connect(
    mapStateToProps,
    mapDispatchToProps
)(NewProject));