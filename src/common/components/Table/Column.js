const React = require('react');

class Column extends React.Component {

    render() {
        return (
            <td>
                {this.props.children}
            </td>
        );
    }
}

module.exports = Column;