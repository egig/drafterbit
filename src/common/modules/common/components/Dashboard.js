import React from 'react';
import Layout from './Layout';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Dashboard extends React.Component {

		renderProjects() {
			const { t, projects } = this.props;

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
	    const { t } = this.props;

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

export default translate(['dashboard'])(
	connect(mapStateToProps)(Dashboard)
);