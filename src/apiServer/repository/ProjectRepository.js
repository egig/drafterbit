const mysql  = require('mysql');
const BaseRespository = require('./BaseRepository');

class ProjectRespository extends BaseRespository {

	/**
	 * Get projects
	 * @return {Promise}
	 */
	getProjects(userId) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			this.connection.query(`SELECT p.* FROM users_projects as up
			JOIN projects as p on p.id = up.project_id
			WHERE up.user_id=?`,
				[userId],
				function (error, results, fields) {
				if (error) return reject(error);
				return resolve(results);
			});

			this.connection.end();

		});
	}

	/**
	 * Get projects
	 * @return {Promise}
	 */
	getProject(projectId) {
		return new Promise((resolve, reject) => {

			let query = `
SELECT p.id, p.name, p.description, ct.id as ct_id, ct.name as ct_name,
ct.description as ct_description, ct.slug as ct_slug
FROM
  projects as p
  LEFT JOIN content_types as ct on ct.project_id = p.id
WHERE p.id=?`;

			this.connection.connect();

			this.connection.query(query, [projectId], function (error, results, fields) {
				if (error) return reject(error);

				let project = {
					content_types: []
				};
				results.map(result => {
					project.id = result.id;
					project.name = result.name;
					project.description = result.description;

					if(result.ct_id !== null ) {
						project.content_types.push({
							id: result.ct_id,
							name: result.ct_name,
							description: result.ct_description,
							slug: result.ct_slug
						})
					}
				});

				return resolve(project);
			});

			this.connection.end();

		});
	}

	/**
	 *
	 * @param name
	 * @param slug
	 * @param description
	 * @param userId
	 * @return {Promise}
	 */
	createProject(name, description, userId) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			this.connection.query('INSERT projects(name, description) VALUES(?,?)',
				[name, description],
				(error, result, fields) => {
					if (error) return reject(error);

					this.connection.query('INSERT users_projects(user_id, project_id, role) VALUES(?,?,?)',
						[userId, result.insertId, 1],
						(err, r) => {

							if (err) return reject(err);

							this.connection.end();
							return resolve(r);
						}
					);
				});

		});
	}


	/**
	 *
	 * @param projectId
	 * @return {Promise}
	 */
	deleteProject(projectId) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			// TODO delete also content types
			this.connection.query('DELETE FROM projects WHERE id=?',
				[projectId],
				(error, results, fields) => {
					if (error) return reject(error);
					return resolve(results);
				});

			this.connection.end();

		});
	}


	/**c
	 *
	 * @param projectId
	 * @param name
	 * @param slug
	 * @param description
	 * @param userId
	 * @return {Promise}
	 */
	updateProject(projectId, name, description) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			this.connection.query('UPDATE projects SET name=?,description=? WHERE id=?',
				[name, description,projectId],
				(error, results, fields) => {
					if (error) return reject(error);
					return resolve(results);
				});

			this.connection.end();

		});
	}


	/**
	 *
	 * @param projectId
	 */
	getContentTypeStat(projectId) {
		return new Promise((resolve, reject) => {

			this.connection.connect();

			let query = `
			SELECT  ct.id, ct.name, count(*) as content_count FROM contents as c
			  JOIN content_types as ct on ct.id = c.content_type_id
			  WHERE ct.project_id = ?
			GROUP BY content_type_id`;

			this.connection.query(query,
				[projectId],
				(error, results, fields) => {
					if (error) return reject(error);
					return resolve(results);
				});

			this.connection.end();

		});
	}
}

module.exports = ProjectRespository;