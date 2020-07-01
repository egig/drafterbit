import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate';
import Card from '@drafterbit/common/client/components/Card/Card';
import withDrafterbit from '@drafterbit/common/client/withDrafterbit';

class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            settings: []
        }
    }

    componentDidMount() {
        let client = this.props.drafterbit.getApiClient2();
        client.getSettings()
            .then(settings => {
                this.setState({
                    settings
                })
            })
    }

    render() {

        return (
            <div className="row justify-content-md-center mt-2">
                <div className="col col-md-12">
                    <Card headerText="Settings">
                        {this.state.settings.map((setting, i) => {
                            return (<table key={i}>
                                <tbody>
                                {Object.keys(setting).map((k,i) => {
                                    if (['fieldset_name', '_id'].indexOf(k) === -1) {
                                        return <tr key={i}><td>{k}</td><td> : {setting[k]}</td></tr>
                                    }
                                })}
                                </tbody>
                            </table>)
                        })}
                    </Card>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.USER.currentUser
    };
};

export default translate(['dashboard'])(connect(mapStateToProps)(withDrafterbit(Settings)));