import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate';
import Card from '../../../components/Card/Card';

class Dashboard extends React.Component {

    render() {

        return (
            <div className="row justify-content-md-center mt-2">
                <div className="col col-md-12">
                    <Card headerText="Home">
                        <p>Welcome !</p>
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

export default translate(['dashboard'])(connect(mapStateToProps)(Dashboard));