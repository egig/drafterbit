import path from 'path';
import React from 'react';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import TablePage from '@drafterbit/common/client-side/components/TablePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile} from '@fortawesome/free-regular-svg-icons';
import {Link} from 'react-router-dom';
import querystring from "querystring";
import DropZone from './DropZone';
import { Card } from 'antd';

class Files extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    }

    loadContents = (match, page, sortBy, sortDir, fqStr, qs) => {

        let client = this.props.$dt.getApiClient();
        let path = qs['path'] || "/";
        return client.getFiles(path)
            .then(files => {
                this.setState({
                    files
                })
            })
    };

    fileDidUpload = (r) => {

        let qs = querystring.parse(this.props.location.search.substr(1));
        let sortBy = qs['sort_by'];
        let sortDir = qs['sort_dir'];
        let fqStr = qs['fq'];
        let page = qs['page'];

        this.loadContents(this.props.match, page, sortBy, sortDir, fqStr, qs)
    };

    render() {

        const columns = [{
            dataField: 'text',
            dataIndex: 'text',
            text: 'Name',
            title: 'Name',
            render: (cell, row) => {
                if (row.type === "dir") {
                    return <span><Link to={`/files?path=${row.path}`}>
                        <FontAwesomeIcon icon={faFolder} /> {cell}
                    </Link></span>;
                }

                return <span><FontAwesomeIcon icon={faFile} /> {cell}</span>;
            }
        }];

        let qs = querystring.parse(this.props.location.search.substr(1));
        let paths = [{
            label: "Files",
            path: "/files?path=/"
        }];

        let uploadPath = "/";
        if (qs['path']) {
            uploadPath = qs['path'];
            let restPath = decodeURIComponent(qs['path']).split("/").filter( p => !!p);
            let cp = "";
            let ps = [];
            restPath.forEach(p => {
                cp = path.join(cp, p);
                ps.push({
                    label: p,
                    path: `/files?path=${cp}`
                })
            });
            paths = paths.concat(ps);
        }

        return (
            <>
                <TablePage
                    headerText="Files"
                    data={ this.state.files }
                    contentCount={0}
                    columns={ columns }
                    // select={true}
                    loadContents={this.loadContents}
                    // handleDelete={this.handleDelete}
                    // onClickAdd={this.onClickAdd}
                    renderContent={(tableFilter, tableData) => {
                        return(
                            <Card>
                                <div style={{marginBottom:"6px"}}/>
                                {tableFilter}
                                <div style={{marginBottom:"6px"}}/>
                                <DropZone path={uploadPath} fileDidUpload={this.fileDidUpload}/>
                                <div style={{marginBottom:"6px"}}/>
                                {paths.map((p,i) => {
                                    return <span key={i}> <Link to={p.path}>{p.label.trim()}</Link> / </span>
                                })}
                                <div style={{marginBottom:"6px"}}/>
                                {tableData}
                            </Card>
                        )
                    }}
                />
            </>
        );
    }
}


export default withDrafterbit(Files);