import React from 'react';
import ProjectLayout from '../../project/components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TableA from '../../../components/Table/TableA';
import Card from '../../../components/Card/Card';

class ApiKeys extends React.Component {

    componentDidMount() {
        this.props.getApiKeys(this.props.project._id);
    }

    render() {

        let columns = [
            {
                label: 'Name',
                accessor: 'name',
                render: (a) => {
                    return <Link to={`/project/${this.props.project.i_d}/api_keys/${a._id}/edit`}>{a.name}</Link>;
                }
            },
            {
                label: 'Key',
                accessor: 'key'
            }
        ];

        return (
            <ProjectLayout>
                <Card headerText="Api Keys">
                    <Link className="btn btn-success mb-3" to={`/project/${this.props.project._id}/api_keys/new`}>Create Api Key</Link>
                    <TableA columns={columns} data={this.props.apiKeys} />
                </Card>
            </ProjectLayout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        project: state.project.project,
        apiKeys: state.project.apiKeys,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeys);