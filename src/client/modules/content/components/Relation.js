import React from 'react';
import apiClient from '../../../apiClient';

class Relation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: []
        };
    }

    componentDidMount() {
        // TODO get apiClient service from drafterbit app singlton
        let client = apiClient.createClient({});
        client.getContents(this.props.relatedContentTypeId)
            .then((res) => {
                this.setState({
                    contents: res.data
                });
            });
    }

    render() {
        return (
            <select multiple={this.props.multiple} className="form-control" id="type" onChange={this.props.onChange} value={this.props.value} >
                {this.state.contents.map((c,i) => {
                    return <option key={i} value={c._id}>{c._id}</option>;
                })}
            </select>
        );
    }
}


export default Relation;