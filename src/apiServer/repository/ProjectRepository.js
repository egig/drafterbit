const mysql  = require('mysql');
const BaseRespository = require('./BaseRepository');
import model from '../../model';

class ProjectRespository extends BaseRespository {

    /**
	 * Get projects
	 * @return {Promise}
	 */
    getProjects(userId) {
        return new Promise((resolve, reject) => {
	        model.Project.find({owner: userId}, function(err, projects) {
		        if (err) return reject(err);
		        return resolve(projects);
	        });
        });
    }

    /**
	 * Get projects
	 * @return {Promise}
	 */
    getProject(projectId) {
	    return new Promise((resolve, reject) => {
		    model.Project.findOne({_id: projectId}).populate('content_types', 'name').exec(function(err, project) {
			    if (err) return reject(err);
			    return resolve(project);
		    });
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

		    let newProject = new Project({
		    	name,
			    description,
			    owner: userId
		    });

		    newProject.save((err, newProject) => {
			    if (err) return reject(err);
			    resolve(newProject)
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