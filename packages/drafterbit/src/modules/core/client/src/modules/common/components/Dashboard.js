import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate';
import Card from '@drafterbit/common/client/components/Card/Card';

class Dashboard extends React.Component {

    render() {

        return (
            <Card headerText="Home">
                <p>Welcome !</p>
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.USER.currentUser
    };
};

export default translate(['dashboard'])(connect(mapStateToProps)(Dashboard));