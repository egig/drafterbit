const React = require('react');
import Style from './AuthCard.style';
import withStyle from '../../../withStyle';
const { Container, Card, CardBody, CardHeader, CardTitle } = require('reactstrap');

class AuthCard extends React.Component {

    render() {

        let classes = this.props.classNames;

        return (
            <div className="h-100 my-login-page">
                <Container className="h-100">
                    <div className="row justify-content-md-center h-100">
                        <div className={classes.cardWrapper}>
                            <div className={`brand ${classes.brandContainer}`}>
                                <img className={classes.brandImg} src="/img/dtlogo57-black.png" />
                            </div>
                            <Card className="fat">
	                            <CardHeader>
		                            {this.props.title}
	                            </CardHeader>
                                <CardBody>
                                    {/*<CardTitle className={`${classes.cardTitleMargin}`}>{this.props.title}</CardTitle>*/}
                                    {this.props.children}
                                </CardBody>
                            </Card>
                            <div className={classes.loginFooter}>
                                Copyright &copy; 2017 &mdash; drafterbit
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

export default withStyle(Style)(AuthCard);