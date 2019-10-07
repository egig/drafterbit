import React from 'react';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Card from 'drafterbit-module-admin/client/src/components/Card/Card';
import DataTable from 'drafterbit-module-admin/client/src/components/DataTable';
import ApiClient from '../ApiClient';

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        let client =  new ApiClient({});

        client.getUsers()
            .then(users => {
                this.setState({
                    users
                });
            });
    }

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
            <Card headerText="Users">
                <DataTable
                    idField='_id'
                    data={ this.state.users }
                    columns={ columns }
                    striped
                    hover
                    condensed />
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        contentTypes: state.CONTENT_TYPE.contentTypes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);