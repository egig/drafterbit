import path from 'path';
import React, {Fragment} from 'react';
import withDrafterbit from 'drafterbit-module-admin/client/src/withDrafterbit';
import TablePage from 'drafterbit-module-admin/client/src/components/TablePage';
import ApiClient from '../ApiClient'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faSquare, faPlusSquare,
faMinusSquare, faFolder, faFolderOpen, faFile} from '@fortawesome/free-regular-svg-icons';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import {Link} from 'react-router-dom';
import querystring from "querystring";

class Files extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    }

    loadContents = (match, page, sortBy, sortDir, fqStr, qs) => {
        let client = new ApiClient(this.props.drafterbit.getAxiosInstance());

        let path = qs['path'] || "/";
        client.getFiles(path)
            .then(files => {
                this.setState({
                    files
                })
            })
    };

    render() {
        const columns = [{
            dataField: 'text',
            text: 'Name',
            formatter: (cell, row) => {
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
        if (qs['path']) {
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
            <Fragment>
                {paths.map((p,i) => {
                    return <span key={i}> <Link to={p.path}>{p.label.trim()}</Link> / </span>
                })}
                <TablePage
                    data={ this.state.files }
                    contentCount={0}
                    columns={ columns }
                    // select={true}
                    loadContents={this.loadContents}
                    // handleDelete={this.handleDelete}
                    // onClickAdd={this.onClickAdd}
                />
            </Fragment>
        );
    }
}


export default withDrafterbit(Files);