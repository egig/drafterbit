import React from 'react';

class TableHeader extends React.Component {

    render() {
        return (
            <thead>
                {this.props.children}
            </thead>
        );
    }
}

export default  TableHeader;