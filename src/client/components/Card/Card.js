const React = require('react');
import { Card as BaseCard, CardHeader, CardBody} from 'reactstrap';

class Card extends React.Component {

    render() {
        return (
            <BaseCard>
                {this.props.headerText &&
                <CardHeader>{this.props.headerText}</CardHeader>
                }
                <CardBody>
                    {this.props.children}
                </CardBody>
            </BaseCard>
        );
    }
}

module.exports = Card;