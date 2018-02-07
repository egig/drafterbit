import React from 'react';
import ProjectLayout from './ProjectLayout';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

class Dashboard extends React.Component {
	render() {
		const { t } = this.props;

		return (
			<ProjectLayout title={t('dashboard:layout_title')}>
				<div className="row justify-content-center">
					<div className="col-4">
						{t('dashboard:no_project_text')} &nbsp;
						<Link className="btn btn-primary" to="/project/new">{t('dashboard:add_project_btn_text')}</Link>
					</div>
				</div>
			</ProjectLayout>
		);
	}
}

export default translate(['dashboard'])(Dashboard);