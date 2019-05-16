import React from 'react';
import Layout from '../../common/components/Layout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Card from '../../../components/Card/Card';
import DataTable from '../../../components/DataTable';
import apiClient from '../../../apiClient';

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        let client =  apiClient.createClient({});
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
            <Layout>
                <Card headerText="Content Types">
                    <DataTable
                        idField='_id'
                        data={ this.state.users }
                        columns={ columns }
                        striped
                        hover
                        condensed />
                </Card>
            </Layout>
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