import React  from 'react';
import { Link } from 'react-router-dom';
import TablePage from '@drafterbit/common/client-side/components/TablePage';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import ApiClient from '../ApiClient';

class ApiKeys extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            apiKeys: []
        }
    }

    loadContents = (match, page, sortBy, sortDir, fqStr) => {
        let client =  new ApiClient(this.props.drafterbit.getAxiosInstance());
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
        let client =  new ApiClient(this.props.drafterbit.getAxiosInstance());
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
                text: 'Name',
                formatter: (cell, row) => {
                    return <Link to={`/api_keys/${row._id}`}>{cell}</Link>;
                }
            },
            {
                dataField: 'key',
                text: 'Key'
            }
        ];

        return (
            <TablePage
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