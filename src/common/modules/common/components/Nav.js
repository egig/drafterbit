import React from 'react';

class Nav extends React.Component {

    render() {
        return(
	        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
		        <div className="container">
			        <a className="navbar-brand" href="#">Drafterbit</a>
			        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
				        <span className="navbar-toggler-icon"/>
			        </button>
			        <div className="collapse navbar-collapse" id="navbarText">
				        <ul className="navbar-nav mr-auto">
					        <li className="nav-item active">
						        <a className="nav-link" href="#">Dashboard <span className="sr-only">(current)</span></a>
					        </li>
					        <li className="nav-item">
						        <a className="nav-link" href="#">Project</a>
					        </li>
					        <li className="nav-item">
						        <a className="nav-link" href="#">Contents</a>
					        </li>
				        </ul>
			        </div>
		        </div>
	        </nav>
        );
    }
}

export default Nav;