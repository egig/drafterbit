import React  from 'react';
import { Link } from 'react-router-dom';
import TablePage from '@drafterbit/common/client-side/components/TablePage';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';

class ApiKeys extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            apiKeys: []
        }
    }

    loadContents = (match, page, sortBy, sortDir, fqStr) => {
        let client =  this.props.$dt.getApiClient();
        return client.getApiKeys()
            .then(apiKeys => {
                this.setState({
                    apiKeys
                })
            })
            .catch(e => {
                console.error(e);
                // TODO
            })
    };

    componentDidMount() {
        let client =  this.props.$dt.getApiClient();
        client.getApiKeys()
            .then(apiKeys => {
                this.setState({
                    apiKeys
                })
            })
            .catch(e => {
                console.error(e);
                // TODO
            })
    }

    render() {

        let columns = [
            {
                dataField: 'name',
                dataIndex: 'name',
                text: 'Name',
                title: 'Name',
                render: (cell, row) => {
                    return <Link to={`/api_keys/${row._id}`}>{cell}</Link>;
                }
            },
            {
                dataField: 'key',
                dataIndex: 'key',
                text: 'Key',
                title: 'Key'
            }
        ];

        return (
            <TablePage
                onClickAdd={() => {
                    this.props.history.push(`/api_keys/0`);
                }}
                addText="New Api Key"
                idField='_id'
                select={true}
                data={ this.state.apiKeys }
                contentCount={10} // TODO
                columns={ columns }
                loadContents={this.loadContents}
            />
        );
    }
}

export default withDrafterbit(ApiKeys);