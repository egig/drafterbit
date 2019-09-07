import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Notify from '../../../components/Notify';
import Card from '../../../components/Card/Card';
import withDrafterbit from '../../../withDrafterbit';

class ApiKeyEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            restrictedType: 0,
            successText: ''
        };
    }

    handleRestrictionTypeChange(e) {
        this.setState({
            restrictedType: e.target.value
        });
    }

    onSubmit(form) {

        let restrictionValue = this.state.restrictedType === 0 ? '' : form.restriction_value.value;

        this.props.drafterbit.getApiClient().createApiKey(
            form.name.value,
            form.key.value,
            this.state.restrictedType,
            restrictionValue
        ).then(r => {
            this.setState({
                successText: 'Api key successfully created'
            });
        });
    }

    render() {

        return (
            <Fragment>
                <div className="row">
                    <div className="col-6">
                        <Card headerText="Create Api Key" >
                            <form onSubmit={e => {
                                e.preventDefault();
                                this.onSubmit(e.target);
                            }}>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" name="name" id="name" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="key">Key</label>
                                    <input type="text" name="key" id="key" className="form-control" readOnly="readOnly" value="GENERATED"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(withDrafterbit(ApiKeyEdit));