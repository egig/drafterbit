const React = require('react');
import ProjectLayout from '../../project/components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import apiClient from './../../../apiClient';
import Card from '../../../components/Card/Card';

class ProjectSetting extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: props.project.name,
            description: props.project.description
        };
    }

    onSubmit(form) {
        apiClient.createClient({}).updateProject(
            this.props.project._id,
            form.project_name.value,
            form.project_description.value);
    }

    doShutdownProject(form) {
        // TODO create alert before delete
        apiClient.createClient({}).deleteProject(form.id.value)
            .then(r => {
                this.props.history.push('/');
            });
    }

    render() {

        return (
            <ProjectLayout>
                <div className="row">
                    <div className="col-6">
                        <Card headerText="Project Detail">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                this.onSubmit(e.target);
                            }}>
                                <div className="form-group">
                                    <label htmlFor="project_name">Name</label>
                                    <input onChange={e => {
                                        this.setState({
                                            name: e.target.value
                                        });
                                    }} className="form-control" type="text" name="project_name" value={this.state.name}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="project_description">Description</label>
                                    <textarea onChange={e => {
                                        this.setState({
                                            description: e.target.value
                                        });
                                    }} className="form-control" name="project_description" value={this.state.description}/>
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </Card>
                        <div className="mb-3" />
                        <Card headerText="Shutdown Project">
                            <div>
                                <p>Your data will be permanently deleted. This action cannot be undone.</p>
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    this.doShutdownProject(e.target);
                                }}>
                                    <input type="hidden" name="id" value={this.props.project._id}/>
                                    <button href="#" className="btn btn-danger">Shutdown Project</button>
                                </form>
                            </div>
                        </Card>
                    </div>
                </div>
            </ProjectLayout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        project: state.project.project,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSetting);