
import React, { Component, Fragment } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux';
// import withDrafterbit from '../../../../../withDrqafterbit';
import withDrafterbit from 'drafterbit-module-admin/client/src/withDrafterbit';

class ContentType extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contentType: props.data.get('content_type'),
      contentEntryOptions: [],
      contentEntryValue: props.data.get('entry'),
    };
  }

  selfDestroy = () => {
    const { "data-key": dataKey } = this.props.attributes;
    const { editor } = this.props;
    editor.removeNodeByKey(dataKey);
  };

  componentDidMount() {
    let contentType = this.props.data.get('content_type');
    if(!!contentType) {
      this.loadContent(contentType);      
    }
  }

  loadContent = (contentType) => {
    this.props.drafterbit.getApiClient().getEntries(contentType)
            .then((res) => {
                this.setState({
                  contentEntryOptions: res.data
                });
            });
  }

  handleBlur = e => {
    e.stopPropagation();

    if(!this.state.contentType) {
      this.selfDestroy();      
    }
  };

  handleChange = (v, action) => {
    this.setState({
      contentType: v.value,
      contentEntryValue: null
    })

    this.loadContent(v.value)
  };
  
  handleEntryChange = (v, action) => {

    this.setState({
      contentEntryValue: v,
    })

    const { editor } = this.props
    const { "data-key": dataKey } = this.props.attributes;

    editor.setNodeByKey(dataKey, { data: {
      content_type: this.state.contentType,
      entry: v 
    }})

  };

  render() {
    const { value } = this.state;
    const { data } = this.props;

    let options = this.props.contentTypes.map(c => {
      return {
        value: c.slug,
        label: c.name
      }
    })

    let defaultValue;

    if(!!data.get('content_type')) {
      defaultValue = options.filter(o => {
        return data.get('content_type') == o.value
      })[0]
    }

    let contentOptions = this.state.contentEntryOptions.map(c => {
      return {
        value: c._id,
        label: c.name // TODO determine default field for entry name
      }
    })

    return (
      <Fragment>
        <label>Select Content Type </label>
        <Select
          defaultValue={defaultValue}
          autoFocus={true}
          onChange={this.handleChange}
          onBlur={this.handleBlur} options={options} />
          <div className="mb-2" />
          <label>Select Entry</label>
        <Select
          defaultValue={data.get("entry")}
          value={this.state.contentEntryValue}
          onChange={this.handleEntryChange}        
          onBlur={this.handleBlur}
          isMulti={false} // TODO suport multi
          options={contentOptions} />
          <div className="mb-3"/>
      </Fragment>
    );
  }
}

ContentType.defaultProps = {
  contentTypes: []
}


const mapStateToProps = (state) => {
  return {
      contentTypes: state.CONTENT_TYPE.contentTypes
  };
}

export default connect(mapStateToProps)(withDrafterbit(ContentType));


