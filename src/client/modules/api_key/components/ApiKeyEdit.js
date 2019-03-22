import React from 'react';
import Layout from '../../common/components/Layout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Notify from '../../../components/Notify';
import apiClient from './../../../apiClient';
import Card from '../../../components/Card/Card';

class ApiKeyNew extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            restrictedType: 0,
            successText: '',
            apiKeyName: '',
            apiKeyValue: '',
            restrictionValue: ''
        };
    }

    componentDidMount() {
        let client = apiClient.createClient({});
        client.getApiKey(this.props.match.params.api_key_id)
            .then(r => {
                this.setState({
                    restrictedType: r.restriction_type,
                    apiKeyName: r.name,
                    apiKeyValue: r.key,
                    restrictionValue: r.restriction_value
                });
            });
    }

    handleRestrictionTypeChange(e) {
        this.setState({
            restrictedType: e.target.value
        });
    }

    onSubmit(form) {

        let restrictionValue = this.state.restrictedType == 0 ? '' : form.restriction_value.value;
        let apiKeyId = this.props.match.params.api_key_id;

        let client = apiClient.createClient({});
        client.updateApiKey(
            this.props.match.params.api_key_id,
            this.state.apiKeyName,
            this.state.apiKeyValue,
            this.state.restrictedType,
            this.state.restrictionValue,
        ).then(r => {
            this.setState({
                successText: 'Api key successfully updated'
            });
        });
    }

    render() {

        return (
            <Layout>
                <div className="row">
                    <div className="col-6">
                        <Card headerText="Edit Api Key" >
                            <form onSubmit={e => {
                                e.preventDefault();
                                this.onSubmit(e.target);
                            }}>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" name="name" id="name" className="form-control" value={this.state.apiKeyName}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="key">Key</label>
                                    <input type="text" name="key" id="key" className="form-control" readOnly="readOnly" value={this.state.apiKeyValue}/>
                                </div>
                                <fieldset className="form-group">
                                    <legend>Restriction Type</legend>
                                    <div className="form-check">
                                        <input onChange={e => this.handleRestrictionTypeChange(e)}
                                            className="form-check-input" type="radio"
                                            name="restriction_type"
                                            id="restriction_type_none"
                                            value="0"
                                            checked={this.state.restrictedType == 0} />
                                        <label className="form-check-label" htmlFor="restriction_type_none">
                                            None
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input onChange={e => this.handleRestrictionTypeChange(e)}
                                            className="form-check-input"
                                            type="radio"
                                            name="restriction_type"
                                            id="restriction_type_http"
                                            value="1"
                                            checked={this.state.restrictedType == 1}/>
                                        <label className="form-check-label" htmlFor="restriction_type_http">
                                            HTTP Referrer
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input onChange={e => this.handleRestrictionTypeChange(e)}
                                            className="form-check-input"
                                            type="radio"
                                            name="restriction_type"
                                            id="restriction_type_ip"
                                            value="2"
                                            checked={this.state.restrictedType == 2}/>
                                        <label className="form-check-label" htmlFor="restriction_type_ip">
                                            IP Address
                                        </label>
                                    </div>
                                </fieldset>

                                {this.state.restrictedType == 1 &&
                                <div className="form-group">
                                    <label htmlFor="restriction_value">HTTP Referer</label>
                                    <input type="text"
                                        value={this.state.restrictionValue}
                                        name="restriction_value"
                                        placeholder="http://localhost"
                                        id="restriction_value"
                                        className="form-control"/>
                                </div>
                                }

                                {this.state.restrictedType == 2 &&
                                <div className="form-group">
                                    <label htmlFor="restriction_value">IP Address</label>
                                    <input type="text"
                                        value={this.state.restrictionValue}
                                        name="restriction_value"
                                        placeholder="127.0.0.1"
                                        id="restriction_value"
                                        className="form-control"/>
                                </div>
                                }

                                <div className="form-group">
                                    <button type="submit" className="btn btn-success">Save</button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
                {this.state.successText &&
                <Notify type="success" message={this.state.successText} />
                }
            </Layout>
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

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyNew);