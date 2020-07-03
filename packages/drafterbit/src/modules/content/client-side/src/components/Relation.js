import React from 'react';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';
import Select from 'react-select'

class Relation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: []
        };
    }

    componentDidMount() {

        let client = this.props.drafterbit.getApiClient();
        client.getEntries(this.props.typeName)
            .then((res) => {
                this.setState({
                    contents: res.data
                });
            });
    }

    render() {

        // TODO make name is default field
        // TODO support async
        // or smartly pick one field as identifier visually
        const options = this.state.contents.map(c => {
            return {
                value: c._id,
                label: c.name,
            }
        });

        let defaultValue;
        if(this.props.multiple) {
            defaultValue = options.filter(o => {
                return this.props.value.indexOf(o.value) !== -1;
            });
        } else {
            let tmp = options.filter(o => {
                return this.props.value === o.value;
            });

            defaultValue = !!tmp.length ? tmp[0] : null;
        }

        return (
            <Select defaultValue={defaultValue}
                    value={defaultValue}
                    onChange={this.props.onChange}
                    isMulti={this.props.multiple}
                    options={options} />
        );
    }
}


export default withDrafterbit(Relation);