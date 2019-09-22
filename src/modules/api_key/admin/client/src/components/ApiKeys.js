import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Card from 'drafterbit-module-admin/client/src/components/Card/Card';
import DataTable from 'drafterbit-module-admin/client/src/components/DataTable';
import withDrafterbit from 'drafterbit-module-admin/client/src/withDrafterbit';

class ApiKeys extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            apiKeys: []
        }
    }

    componentDidMount() {
        this.props.drafterbit.getApiClient().getApiKeys()
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
            <Fragment>
                <Card headerText="Api Keys">
                    <Link className="btn btn-success mb-3" to={'/api_keys/new'}>Create Api Key</Link>
                    <DataTable
                        idField='_id'
                        data={ this.state.apiKeys }
                        columns={ columns }
                        striped
                        hover
                        condensed />
                </Card>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        apiKeys: state.API_KEY.apiKeys,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(ApiKeys));