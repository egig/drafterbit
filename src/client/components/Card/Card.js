const React = require('react');
import { Card as BaseCard, CardHeader, CardBody} from 'reactstrap';

class Card extends React.Component {

    render() {
        return (
            <BaseCard className={this.props.className}>
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

export default Card;