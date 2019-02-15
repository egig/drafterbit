const BaseRespository = require('./BaseRepository');
const model = require('../model');

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
		    model.Project.findOne({_id: projectId})
			    .populate('owner', ['id', 'name', 'email'])
			    .exec(function(err, project) {

			    	model.ContentType.find({project: projectId}, (err, contentTypes) => {

			    		project.content_types = contentTypes;
					    if (err) return reject(err);
					    return resolve(project);

				    });
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

		    let newProject = new model.Project({
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
		    model.Project.deleteOne({_id: projectId}, function(err) {
			    if (err) return reject(err);
			    return resolve(true);
		    });
	    });

    }


	/**
	 *
	 * @param projectId
	 * @param payload
	 * @return {Promise}
	 */
	updateProject(projectId, payload) {
        return new Promise((resolve, reject) => {

	        model.Project.update({ _id: projectId },payload,function(err, res) {
		        if (err) return reject(err);
		        return resolve(res);
	        });
        });
    }


    /**
	 *
	 * @param projectId
	 */
    getContentTypeStat(projectId) {
        return new Promise((resolve, reject) => {
        	// TODO
	        resolve([])
        });
    }
}

module.exports = ProjectRespository;