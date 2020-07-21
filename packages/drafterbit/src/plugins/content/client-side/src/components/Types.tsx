import React  from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import TypeForm from './TypeForm';
// @ts-ignore
import TablePage from '@drafterbit/common/client-side/components/TablePage';
import { message } from 'antd';
import ClientSide from "../../../../admin/client-side/src/ClientSide";

type Props = {
    $dt: ClientSide,
    history: any
}

type State = {
    newFormOpen: boolean,
    types: any[],
    contentCount: number
}

class Types extends React.Component<Props,State> {

    state: State = {
        newFormOpen: false,
        types: [],
        contentCount: 0
    };

    constructor(props: any) {
        super(props);
    }

    loadContents = () => {
        let client = this.props.$dt.getApiClient();
        return client.getTypes()
            .then((response: any) => {
                this.setState({
                    contentCount: response.count,
                    types: response.list
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
            render: (cell: any, row: any) => {
                return <Link to={`/types/${row._id}`}>{cell}</Link>;
            }
        }];

        return (
            <>
                <TablePage
                    headerText="Types"
                    data={ this.state.types }
                    contentCount={this.state.contentCount}
                    columns={ columns }
                    select={true}
                    loadContents={this.loadContents}
                    // handleDelete={this.handleDelete}
                    onClickAdd={this.onClickAdd}
                />
                <TypeForm visible={this.state.newFormOpen}
                    onCancel={(e: any) => {
                        this.setState({
                            newFormOpen: false  
                        })
                    }}
                    onSuccess={(type: any) => {
                        message.success("Content Type Saved Successfully !");
                        this.setState({
                            newFormOpen: false
                        });
                        setTimeout(() => {
                            this.props.history.push(`/types/${type._id}`);
                        }, 2000)
                    }}
                 />
            </>
        );
    }
}

export default withDrafterbit(Types);