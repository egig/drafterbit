import React from 'react';
import ProjectLayout from '../../project/components/ProjectLayout';
import { Link } from 'react-router-dom';
import actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ApiKeyNew extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			restrictedType: 0
		}
	}

	handleRestrictionTypeChange(e) {
		this.setState({
			restrictedType: e.target.value
		});
	}

	render() {

		return (
			<ProjectLayout title="Create Api Key">
				<div className="row">
					<div className="col-6">
						<form>
							<div className="form-group">
								<label htmlFor="name">Name</label>
								<input type="text" name="name" id="name" className="form-control"/>
							</div>
							<div className="form-group">
								<label htmlFor="key">Key</label>
								<input type="text" name="key" id="key" className="form-control" readOnly="readOnly"/>
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
					</div>
				</div>
			</ProjectLayout>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		project: state.project.project,
		apiKeys: state.project.apiKeys,
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyNew);