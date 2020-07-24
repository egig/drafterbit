import React  from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { withDrafterbit, TablePage } from '@drafterbit/common';
import TypeForm from './TypeForm';
// @ts-ignore
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

    loadContents = (page: number, pageSize: number, sortBy: string, sortDir: string, fqStr: string) => {
        let client = this.props.$dt.getApiClient();
        return client.getTypes({
            page,
            page_size: pageSize,
            sort_by: sortBy,
            sort_dir: sortDir,
            fq: fqStr
        })
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