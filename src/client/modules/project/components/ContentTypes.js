const React = require('react');
import ProjectLayout from './ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Card from '../../../components/Card/Card';
import BootstrapTable from 'react-bootstrap-table-next';

class ContentTypes extends React.Component {

    componentDidMount() {
        this.props.getContentTypes();
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if(prevProps.project['_id'] !=  this.props.project._id) {
    //         this.props.getContentTypes(this.props.project._id);
    //     }
    // }

    render() {

        const columns = [{
            dataField: 'name',
            text: 'Name',
            formatter: (cell, row) => {
                return <Link to={`/content_types/${row._id}`}>{cell}</Link>;
            }
        }];

        return (
            <ProjectLayout>
                <Card headerText="Content Types">
                    <Link to={`/content_types/new`} className="btn btn-success mb-3">Add Content Type</Link>
                    <BootstrapTable bootstrap4
                        keyField='_id'
                        data={ this.props.contentTypes }
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
        contentTypes: state.common.contentTypes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentTypes);