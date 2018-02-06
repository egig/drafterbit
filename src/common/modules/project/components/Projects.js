import React from 'react';
import Layout from '../../common/components/Layout';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

class Projects extends React.Component {
	render() {
		const { t } = this.props;

		return (
			<Layout title={t('project:layout_title')}>
				<div className="row justify-content-center">
					<div className="col-4">
						{t('project:no_project_text')} &nbsp;
						<Link className="btn btn-primary" to="/project/new">{t('project:add_project_btn_text')}</Link>
					</div>
				</div>
			</Layout>
		);
	}
}

export default translate(['project'])(Projects);