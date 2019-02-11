const React = require('react');

class Row extends React.Component {

    render() {
        return (
            <tr>
                {this.props.children}
            </tr>
        );
    }
}

export default Row;