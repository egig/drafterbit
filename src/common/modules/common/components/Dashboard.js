import React from 'react';
import Layout from './Layout';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

class Dashboard extends React.Component {
    render() {
	    const { t } = this.props;

	    return (
		    <Layout title={t('dashboard:layout_title')}>
		        <div className="row justify-content-center mt-4">
			        <div className="col-4">
				        {t('dashboard:no_project_text')} &nbsp;
				        <Link className="btn btn-primary" to="/project/new">{t('dashboard:add_project_btn_text')}</Link>
			        </div>
		        </div>
	        </Layout>
        );
    }
}

export default translate(['dashboard'])(Dashboard);