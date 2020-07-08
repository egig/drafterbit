import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import TypeForm from './TypeForm';
import TablePage from '@drafterbit/common/client-side/components/TablePage';
import { message } from 'antd';

class Types extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newFormOpen: false,
            types: []
        };
    }

    loadContents = () => {
        let client = this.props.$dt.getApiClient();
        return client.getTypes()
            .then((types) => {
                this.setState({
                    types: types
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
            dataIndex: 'name',
            title: 'Name',
            render: (cell, row) => {
                return <Link to={`/types/${row._id}`}>{cell}</Link>;
            }
        }];

        return (
            <Fragment>
                <TablePage
                    headerText="Types"
                    data={ this.state.types }
                    contentCount={this.state.contentCount}
                    columns={ columns }
                    select={true}
                    loadContents={this.loadContents}
                    handleDelete={this.handleDelete}
                    onClickAdd={this.onClickAdd}
                />
                <TypeForm visible={this.state.newFormOpen}
                    onCancel={e => {
                        this.setState({
                            newFormOpen: false  
                        })
                    }}
                    onSuccess={type => {
                        message.success("Content Type Saved Successfully !");
                        this.setState({
                            newFormOpen: false
                        });
                        setTimeout(() => {
                            this.props.history.push(`/types/${type._id}`);
                        }, 2000)
                    }}
                 />
            </Fragment>
        );
    }
}

export default withDrafterbit(Types);