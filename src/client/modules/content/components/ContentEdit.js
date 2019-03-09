const React = require('react');
const {connect} = require('react-redux');
const {bindActionCreators } = require('redux');
const actions = require ('../actions');
const ProjectLayout =  require('../../project/components/ProjectLayout');
const Field = require('./Field');
const Notify = require('../../../components/Notify');
const Card = require('../../../components/Card/Card');

class ContentEdit extends React.Component {

    constructor(props) {
        super(props);
        this.formData = {};
        this.state = {
            successText: '',
            formData: {}
        };
    }

    onSubmit(form) {
        this.props.updateContent(this.props.match.params.content_id, Object.values(this.formData))
            .then(r => {
                this.setState({
                    successText: 'Content successfully updated'
                });
            });
    }

    componentDidMount() {
        let params = this.props.match.params;
        let contentId = params.content_id;
        let projectId = params.project_id;
        let slug = params.content_type_slug;
        this.props.getCTFieldsAndGetContent(projectId, slug, contentId);
    }

    componentDidUpdate(prevProps) {
        if(this.props.content !== prevProps.content) {
            console.log('updating content');
            this.props.content.fields.map(f => {
                this.formData[f.name] = f;
                this.setState({
                    formData: this.formData
                });

            });
        }
    }

    render() {
        return (
            <ProjectLayout>
                <div className="col-8">
                    <Card headerText="Add Content" >
                        <form onSubmit={e => {
                            e.preventDefault();
                            this.onSubmit(e.target);
                        }} >
                            {this.props.contentTypeFields.map((f,i) => {


                                let value = this.formData[f.name] ? this.formData[f.name].value : '';

                                // CKEditor
                                if(f.type_id =='3') {
                                    return <Field value={value} onChange={(e) => {

                                        this.formData[f.name] = {
                                            label: f.label,
                                            type_id: f.type_id,
                                            name: f.name,
                                            value: e.target.getContent()
                                        };

                                    }} key={i} field={f} />;
                                }

                                return <Field value={value} onChange={e => {

                                    let value = e.target.value;
                                    this.setState(oldState => {

                                        let formData = oldState.formData;
                                        formData[f.name] = {
                                            label: f.label,
                                            type_id: f.type_id,
                                            name: f.name,
                                            value
                                        };
                                        return Object.assign({}, oldState, {
                                            formData
                                        });

                                    });


                                }} key={i} field={f} />;
                            })}

                            <div className="form-group">
                                <button type="submit" className="btn btn-success">Save</button>
                            </div>
                        </form>
                    </Card>
                </div>
                {this.state.successText && <Notify type="success" message={this.state.successText} />}
            </ProjectLayout>);
    }
}

const mapStateToProps = (state) => {
    return {
        content: state.content.content,
        contentTypeFields: state.content.ctFields.fields
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentEdit);