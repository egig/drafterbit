import React from 'react';

class TableBody extends React.Component {

    render() {
        return (
            <tbody>
                {this.props.children}
            </tbody>
        );
    }
}

export default  TableBody;