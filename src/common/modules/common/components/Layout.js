import React from 'react';
import withStyle from '../../../withStyle';
import Style from './Layout.style';
import { Link } from 'react-router-dom';

class Layout extends React.Component {
	render() {

		let { classNames } = this.props;

		return (
			<span>
				<nav className={`${classNames.navbar} navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0`}>
		      <a className={`${classNames.navbarBrand} navbar-brand col-sm-3 col-md-2 mr-0`} href="#">drafterbit</a>
		      <ul className="navbar-nav px-3">
		        <li className="nav-item text-nowrap">
		          <a className="nav-link" href="#">Sign out</a>
		        </li>
		      </ul>
		    </nav>
				<div className="container-fluid">
		      <div className="row">
		        <nav className={`col-md-2 d-none d-md-block bg-light ${classNames.sidebar}`}>
		          <div className={classNames.sidebarSticky}>
		            <ul className="nav flex-column">
		              <li className="nav-item">
		                <Link className="nav-link active" to="/">
		                  <span data-feather="home"></span>
		                  Dashboard <span className="sr-only">(current)</span>
		                </Link>
		              </li>
		              <li className="nav-item">
		                <Link className="nav-link" to="/projects">
		                  <span data-feather="shopping-cart"></span>
		                  Projects
		                </Link>
		              </li>
		            </ul>

		            {/*<h6 className={`${classNames.sidebarHeading} d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted`}>*/}
		              {/*<span>Saved reports</span>*/}
		              {/*<a className="d-flex align-items-center text-muted" href="#">*/}
		                {/*<span data-feather="plus-circle"></span>*/}
		              {/*</a>*/}
		            {/*</h6>*/}
		            {/*<ul className="nav flex-column mb-2">*/}
		              {/*<li className="nav-item">*/}
		                {/*<a className="nav-link" href="#">*/}
		                  {/*<span data-feather="file-text"></span>*/}
		                  {/*Current month*/}
		                {/*</a>*/}
		              {/*</li>*/}
		              {/*<li className="nav-item">*/}
		                {/*<a className="nav-link" href="#">*/}
		                  {/*<span data-feather="file-text"></span>*/}
		                  {/*Last quarter*/}
		                {/*</a>*/}
		              {/*</li>*/}
		              {/*<li className="nav-item">*/}
		                {/*<a className="nav-link" href="#">*/}
		                  {/*<span data-feather="file-text"></span>*/}
		                  {/*Social engagement*/}
		                {/*</a>*/}
		              {/*</li>*/}
		              {/*<li className="nav-item">*/}
		                {/*<a className="nav-link" href="#">*/}
		                  {/*<span data-feather="file-text"></span>*/}
		                  {/*Year-end sale*/}
		                {/*</a>*/}
		              {/*</li>*/}
		            {/*</ul>*/}
		          </div>
		        </nav>

		        <main role="main" className={`col-md-9 ml-sm-auto col-lg-10 pt-3 px-4`}>
		          <h2>Section title</h2>
			        {this.props.children}
		        </main>
		      </div>
		    </div>
			</span>
		);
	}
}

export default withStyle(Style)(Layout);