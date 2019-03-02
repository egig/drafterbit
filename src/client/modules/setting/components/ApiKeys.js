const React = require('react');
import ProjectLayout from '../../project/components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Card from '../../../components/Card/Card';
import BootstrapTable from 'react-bootstrap-table-next';

class ApiKeys extends React.Component {

    componentDidMount() {
        this.props.getApiKeys(this.props.project._id);
    }

    render() {

        let columns = [
            {
                dataField: 'name',
                text: 'Name',
                formatter: (cell, row) => {
                    return <Link to={`/project/${this.props.project._id}/api_keys/${row._id}/edit`}>{cell}</Link>;
                }
            },
            {
                dataField: 'key',
                text: 'Key'
            }
        ];

        return (
            <ProjectLayout>
                <Card headerText="Api Keys">
                    <Link className="btn btn-success mb-3" to={`/project/${this.props.project._id}/api_keys/new`}>Create Api Key</Link>
                    <BootstrapTable bootstrap4
                        keyField='_id'
                        data={ this.props.apiKeys }
                        columns={ columns }
                        striped
                        hover
                        condensed />
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