import React from 'react';
import Layout from '../../common/components/Layout';
import { translate } from 'react-i18next';

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
							<button type="submit" className="btn btn-primary">{t("project:new_form.create")}</button>
						</form>
					</div>
				</div>
			</Layout>
		);
	}
}

export default translate(['project'])(NewProject);