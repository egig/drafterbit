import React from 'react';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Card from 'drafterbit-module-admin/client/src/components/Card/Card';
import DataTable from 'drafterbit-module-admin/client/src/components/DataTable';
import TablePage from 'drafterbit-module-admin/client/src/components/TablePage';
import withDrafterbit from 'drafterbit-module-admin/client/src/withDrafterbit';
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
    }

    // componentDidMount() {
    //     let client =  new ApiClient({});
    //
    //     client.getUsers()
    //         .then(users => {
    //             this.setState({
    //                 users
    //             });
    //         });
    // }

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

const mapStateToProps = (state) => {
    return {
        contentTypes: state.CONTENT.contentTypes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default withDrafterbit(connect(mapStateToProps, mapDispatchToProps)(Users));