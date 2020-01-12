import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import withDrafterbit from 'drafterbit-module-admin/client/src/withDrafterbit';
import ContentTypeForm from './ContentTypeForm';
import { setNotifyText }  from '../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import TablePage from '../../../../../admin/client/src/components/TablePage';
import ApiClient from '../ApiClient';

class ContentTypes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newFormOpen: false,
            contentTypes: []
        };
    }

    loadContents = () => {
        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());
        client.getContentTypes()
            .then((contentTypes) => {
                this.setState({
                    contentTypes: contentTypes
                });
            })
    };

    onClickAdd = () => {
        this.setState({
            newFormOpen: true
        })
    };

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
                <TablePage
                    headerText="Content Types"
                    data={ this.state.contentTypes }
                    contentCount={this.state.contentCount}
                    columns={ columns }
                    select={true}
                    loadContents={this.loadContents}
                    handleDelete={this.handleDelete}
                    onClickAdd={this.onClickAdd}
                />
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