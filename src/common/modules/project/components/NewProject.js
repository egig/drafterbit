import React from 'react';
import Layout from '../../common/components/Layout';

class NewProject extends React.Component {
	render() {
		return (
			<Layout>
				<div className="row justify-content-md-center">
					<div className="col col-md-6">
						<form >
							<div className="form-group">
								<label htmlFor="exampleInputEmail1">Project Name</label>
								<input type="text" name="project_name" className="form-control" />
							</div>
							<button type="submit" className="btn btn-primary">Create</button>
						</form>
					</div>
				</div>
			</Layout>
		);
	}
}

export default NewProject;