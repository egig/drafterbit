import React from 'react';

class Table extends React.Component {

    render() {
        return (
            <table className="table table-sm table-bordered table-hove">
                {this.props.children}
            </table>
        );
    }
}

export default  Table;