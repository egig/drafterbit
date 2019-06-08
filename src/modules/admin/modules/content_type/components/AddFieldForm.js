import React from 'react';
import { connect } from 'react-redux';
import { getFieldTypes } from '../../../../../fieldTypes';
import _ from 'lodash';

// TODO create blank content type instead and save as draft
class AddFieldForm extends React.Component {

    render() {
        return (
            <div>
                <form onSubmit={this.props.onSubmit}>
                    <h4>Add Field</h4>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select className="form-control" id="type" onChange={this.props.onTypeChange}>
                            {getFieldTypes().map((f,i) => {
                                return <option key={i} value={f.id}>{f.name}</option>;
                            })}
                        </select>
                    </div>
                    {!!_.includes([4,5], parseInt(this.props.fieldTypeSelected)) &&
          <div className="form-group">
              <select className="form-control" name="related_content_type_id" id="related_content_type_id">
                  {this.props.contentTypes.map((ct,i) => {
                      return <option key={i} value={ct.slug}>{ct.name}</option>;
                  })}
              </select>
          </div>
                    }
                    <div className="form-group">
                        <label htmlFor="label">Label</label>
                        <input type="text" className="form-control" name="label" id="label"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" name="name" id="name"/>
                    </div>
                    <button type="submit" className="btn btn-success">Add Field</button>&nbsp;
                    <button onClick={this.props.onCancel} className="btn btn-light">Cancel</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        contentTypes: state.CONTENT_TYPE.contentTypes
    };
};
export default connect(mapStateToProps)(AddFieldForm);