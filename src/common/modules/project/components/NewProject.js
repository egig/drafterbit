import React from 'react';
import Layout from '../../common/components/Layout';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

class NewProject extends React.Component {
	render() {
		const { t } = this.props;
		return (
			<Layout title={t("project:layout_title_new")}>
				<div className="row justify-content-md-center mt-4">
					<div className="col col-md-6">
						<form >
							<div className="form-group">
								<label htmlFor="exampleInputEmail1">{t("project:new_form.project_name")}</label>
								<input type="text" name="project_name" className="form-control" />
							</div>
							<div className="form-group">
								<button type="submit" className="btn btn-primary">{t("project:new_form.create")}</button>
								<Link to="/" className="btn btn-link ml-1">{t("project:new_form.cancel")}</Link>
							</div>
						</form>
					</div>
				</div>
			</Layout>
		);
	}
}

export default translate(['project'])(NewProject);