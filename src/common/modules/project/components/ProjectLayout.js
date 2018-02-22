import React from 'react';
import Layout from '../../common/components/Layout';
import ProjectNav from './ProjectNav';

class ProjectLayout extends React.Component {
	render() {

		return (
			<Layout title={this.props.titel}>
				<ProjectNav />
				<main role="main" className={`col-md-9 ml-sm-auto col-lg-10 pt-3 px-4`}>
					<h2>{this.props.title}</h2>
					{this.props.children}
				</main>
			</Layout>
		);
	}
}

Layout.defaultProps = {
	title: "Untitled Page"
};


export default ProjectLayout;