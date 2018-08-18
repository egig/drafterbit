import React from 'react';
import ProjectLayout from '../components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Notify from '../../../components/Notify';
import Card from '../../../components/Card/Card';

class ContentType extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            slug: '',
            description: '',
            fields: [],
            notifyText: ''
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            id: nextProps.contentType.id,
            name: nextProps.contentType.name,
            slug: nextProps.contentType.slug,
            description: nextProps.contentType.description,
            fields: nextProps.contentType.fields
        });
    }

    componentDidMount() {
        this.props.getContentType(this.props.match.params.content_type_id);
    }

    deleteContentType(deleteForm) {
        // TODO create alert
        this.props.deleteContentType(deleteForm.id.value)
            .then(r => {
                this.props.history.push(`/project/${this.props.project._id}/content_types`);
            });
    }

    onSubmit(form) {
        this.props.updateContentType(
            this.state.id,
            form.name.value,
            form.slug.value,
            form.description.value
        ).then(r => {
            this.setState({
                notifyText: 'Content type successfully saved.'
            });
        });
    }

    render() {

        return (
            <ProjectLayout>
                <div className="col-6 mb-3">
                    <Card headerText={`Edit Content Type : ${this.props.contentType.name}`}>
                        <form onSubmit={e => {
                            e.preventDefault();
                            this.onSubmit(e.target);
                        }}>
                            <div className="form-group">
                                <label>Name</label>
                                <input onChange={e => {
                                    this.setState({name: e.target.value});
                                }} className="form-control" type="text" name="name" id="name" value={this.state.name} />
                            </div>
                            <div className="form-group">
                                <label>Slug</label>
                                <input onChange={e => {
                                    this.setState({slug: e.target.value});
                                }} className="form-control" type="text" name="slug" id="slug"  value={this.state.slug} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input onChange={e => {
                                    this.setState({description: e.target.value});
                                }} className="form-control" type="text" name="description" id="description"  value={this.state.description} />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success">Save</button>
                            </div>
                        </form>
                    </Card>
                    <div className="mb-3" />

                    <Card headerText={`Delete Content Type : ${this.props.contentType.name}`}>
                        <form onSubmit={e => { e.preventDefault(); this.deleteContentType(e.target); }}>
                            <input type="hidden" name="id" id="id" value={this.state.id} />
                            <button type="submit" className="btn btn-danger">Delete Content Type</button>
                        </form>
                    </Card>
                    <div className="mb-3" />

                    <Card headerText="Fields">
                        <table className="table table-sm table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.fields.map((f,i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{f.name}</td>
                                            <td>{f.type}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Card>

                </div>
                {this.state.notifyText &&
					<Notify type="success" message={this.state.notifyText} />
                }
            </ProjectLayout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        project: state.project.project,
        contentType: state.project.contentType,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentType);