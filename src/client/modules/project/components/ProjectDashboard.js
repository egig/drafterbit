const React = require('react');
import ProjectLayout from './ProjectLayout';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import apiClient from './../../../apiClient';
import Card from '../../../components/Card/Card';

class ProjectDashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            contentTypeStat: []
        };
    }

    componentDidMount() {
        let client  = apiClient.createClient({});
        client.getProjectStat(this.props.match.params.project_id)
            .then(r => {
                this.setState({
                    contentTypeStat: r.content_type
                });
            });
    }

    render() {

        return (
            <ProjectLayout>
                <Card headerText="Project Dashboard">
                    {!this.props.project.content_types.length &&
						<div className="col-6">
						    <p>There is no content type yet :(</p>
						    <Link to={`/project/${this.props.project._id}/content_types/new`} className="btn btn-success">Create Content Type</Link>
						</div>
                    }

                    {!!this.state.contentTypeStat.length &&
						<div className="col col-md-4">
						    <ul className="list-group">
						        {this.state.contentTypeStat.map((item,i) => {

						            return (
						                <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
						                    {item.name }
						                    <span className="badge badge-primary badge-pill">{item.content_count}</span>
						                </li>
						            );
						        })}
						    </ul>
						</div>
                    }

                </Card>
            </ProjectLayout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        project: state.project.project
    };
};

export default connect(mapStateToProps)(ProjectDashboard);