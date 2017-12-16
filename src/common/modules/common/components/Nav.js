import React from 'react';

class Nav extends React.Component {

    render() {
        return(
	        <aside className="column is-2">
		        <nav className="menu">
			        <p className="menu-label">
				        General
			        </p>
			        <ul className="menu-list">
				        <li><a href="/"><span className="icon is-small"><i className="fa fa-tachometer"></i></span> Dashboard</a></li>
			        </ul>
			        <p className="menu-label">
				        Content
			        </p>
			        <ul className="menu-list">
				        <li><a href="/"><span className="icon is-small"><i className="fa fa-pencil-square-o"></i></span> Posts</a></li>
				        <li><a href="/"><span className="icon is-small"><i className="fa fa-desktop"></i></span> Categories</a></li>
				        <li><a href="/"><span className="icon is-small"><i className="fa fa-table"></i></span> Tags</a></li>
			        </ul>
			        <p className="menu-label">
				        User
			        </p>
			        <ul className="menu-list">
				        <li><a><span className="icon is-small"><i className="fa fa-bug"></i></span> Manage Users</a></li>
			        </ul>
		        </nav>
	        </aside>
        );
    }
}

export default Nav;