import React from 'react';
import TablePage from '../../../../core/client/src/components/TablePage';
import withDrafterbit from '../../../../core/client/src/withDrafterbit';
import ApiClient from '../ApiClient';

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        };

    }

    loadContents = (match, page, sortBy, sortDir, fqStr) => {
        let client =  new ApiClient(this.props.drafterbit.getAxiosInstance());

        client.getUsers()
            .then(users => {
                this.setState({
                    users
                });
            });
    };

    render() {

        const columns = [
            {
                dataField: '_id',
                text: 'ID'
            },
            {
                dataField: 'name',
                text: 'Name'
            },
            {
                dataField: 'email',
                text: 'Email'
            }
        ];

        return (
            <TablePage
                headerText="Users"
                idField='_id'
                select={true}
                data={ this.state.users }
                contentCount={10} // TODO
                columns={ columns }
                loadContents={this.loadContents}
            />
        );
    }
}

export default withDrafterbit(Users);