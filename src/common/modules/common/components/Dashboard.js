import React from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Dashboard extends React.Component {

		renderProjects() {
			const { projects } = this.props;
			let t = s => s;

			if(!projects.length) {
				return (
					<div className="col-4">
						{t('dashboard:no_project_text')} &nbsp;
						<Link className="btn btn-primary" to="/project/new">{t('dashboard:add_project_btn_text')}</Link>
					</div>
				)
			}

			return (
				<ul>
					{projects.map((item,i) => {
						return <li key={i}><a href="">{item.name}</a></li>
					})}
				</ul>
			)
		}

    render() {
	    let t = s => s;

	    return (
		    <Layout title={t('dashboard:layout_title')}>
		        <div className="row justify-content-center mt-4">
			        {this.renderProjects()}
		        </div>
	        </Layout>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		projects: state.project.projects
	};
};

export default connect(mapStateToProps)(Dashboard);