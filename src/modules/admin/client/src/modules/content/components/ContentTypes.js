import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/Card/Card';
import DataTable from '../../../components/DataTable';
import withDrafterbit from '../../../withDrafterbit';
import ContentTypeForm from './ContentTypeForm';
import { setNotifyText }  from '../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

class ContentTypes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newFormOpen: false,
            contentType: []
        };
    }

    componentDidMount() {
        this.props.drafterbit.getApiClient().getContentTypes()
            .then((contentTypes) => {
                this.setState({
                    contentTypes: contentTypes
                });
            })
    }

    render() {

        const columns = [{
            dataField: 'name',
            text: 'Name',
            formatter: (cell, row) => {
                return <Link to={`/content_types/${row._id}`}>{cell}</Link>;
            }
        }];

        return (
            <Fragment>
                <Card headerText="Content Types">
                    <button onClick={e => {
                        console.log(this.state.newFormOpen);
                        this.setState({
                            newFormOpen: true
                        })
                    }}
                    className="btn btn-success mb-3">Add Content Type</button>
                    <DataTable
                        idField='_id'
                        data={ this.state.contentTypes }
                        columns={ columns }
                        striped
                        hover
                        condensed />
                </Card>
                <ContentTypeForm isOpen={this.state.newFormOpen}
                    onCancel={e => {
                        this.setState({
                            newFormOpen: false  
                        })
                    }}
                    onSuccess={contentType => {
                        this.props.actions.setNotifyText("Content Type Saved Successfully !");
                        this.setState({
                            newFormOpen: false
                        })
                        setTimeout(() => {
                            this.props.history.push(`/content_types/${contentType._id}`);
                        }, 2000)
                    }}
                 />
            </Fragment>
        );
    }
}



const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            setNotifyText
        }, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(withDrafterbit(ContentTypes));