import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Nav extends React.Component {

    render() {
        return(
	        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
		        <div className="container">
			        <Link className="navbar-brand" to="/">drafterbit</Link>
			        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
				        <span className="navbar-toggler-icon"/>
			        </button>
			        <div className="collapse navbar-collapse" id="navbarText">
				        <ul className="navbar-nav mr-auto">
					        <li className="nav-item active">
						        <Link className="nav-link" to="/">Dashboard <span className="sr-only">(current)</span></Link>
					        </li>
					        <li className="nav-item">
						        <Link className="nav-link" to="/project">Projects</Link>
					        </li>
				        </ul>
			        </div>

			        {this.props.currentUser &&
			        <div className="collapse navbar-collapse">
				        <ul className="navbar-nav ml-auto">
					        <li className="nav-item active">
						        <a className="nav-link" href="/logout">Logout</a>
					        </li>
				        </ul>
			        </div>
			        }
		        </div>
	        </nav>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.user.currentUser
	};
};

export default connect(mapStateToProps)(Nav);