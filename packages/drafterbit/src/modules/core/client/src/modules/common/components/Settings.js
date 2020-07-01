import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate';
import Card from '@drafterbit/common/client/components/Card/Card';
import withDrafterbit from '@drafterbit/common/client/withDrafterbit';

class Settings extends React.Component {

    componentDidMount() {
        let client = this.props.drafterbit.getApiClient2();
        client.getSettings()
            .then(r => {
                console.log(r)
            })
    }

    render() {

        return (
            <div className="row justify-content-md-center mt-2">
                <div className="col col-md-12">
                    <Card headerText="Home">
                        <p>Setting Page !</p>
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