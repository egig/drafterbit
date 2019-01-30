import React from 'react';
import ProjectLayout from '../components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TableA from '../../../components/Table/TableA';
import Card from '../../../components/Card/Card';

class ContentTypes extends React.Component {

    componentDidMount() {
        this.props.getContentTypes(this.props.project._id);
    }

    render() {

        return (
            <ProjectLayout>
                <Card headerText="Content Types">
                    <Link to={`/project/${this.props.project._id}/content_types/new`} className="btn btn-success mb-3">Add Content Type</Link>
                    <TableA data={this.props.contentTypes} columns={[
                        {label: 'Name', render: (item) => {
                            return <Link to={`/project/${this.props.project._id}/content_types/${item._id}`}>{item.name}</Link>;
                        }}
                    ]} />
                </Card>
            </ProjectLayout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        project: state.project.project,
        contentTypes: state.project.contentTypes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentTypes);