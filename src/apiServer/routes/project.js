const express = require('express');
let router = express.Router();
const password = require('../lib/password');
const config = require('../../config');
const ProjectRepository = require('../repository/ProjectRepository');
const validateRequest = require('../middlewares/validateRequest');

/**
 * @swagger
 * /users/:user_id/projects:
 *   get:
 *     description: Get user's projects
 *     parameters:
 *       - in: path
 *         name: user_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Project
 */
router.get('/users/:user_id/projects',
	validateRequest({
		user_id: {
			notEmpty: true,
			errorMessage: "user_id is required"
		}
	}),
	function (req, res) {

	(async function () {

		try {
			let r = new ProjectRepository(req.app);
			let results = await r.getProjects(req.params.user_id);
			res.send(results);
		} catch (e ) {
			res.status(500)
			res.send(e.message);
		}

	})()

});

/**
 * @swagger
 * /projects/:project_id:
 *   get:
 *     description: Get single project
 *     parameters:
 *       - in: path
 *         name: project_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *     tags:
 *        - Project
 */
router.get('/projects/:project_id',
	validateRequest({
		project_id: {
			notEmpty: true,
			errorMessage: "project_id required"
		}
	}),
	function (req, res) {

	(async function () {

		try {
			let r = new ProjectRepository(req.app);
			let results = await r.getProject(req.params.project_id);
			res.send(results);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})()

});


/**
 * @swagger
 * /projects/:project_id:
 *   get:
 *     description: Get projects statistics
 *     parameters:
 *       - in: path
 *         name: project_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *     tags:
 *        - Project
 */
router.get('/projects/:project_id/stat',
	validateRequest({
		project_id: {
			notEmpty: true,
			errorMessage: "project_id required"
		}
	}),
	function (req, res) {

	(async function () {

		try {
			let r = new ProjectRepository(req.app);
			let contentTypeStat = await r.getContentTypeStat(req.params.project_id);
			res.send({
				content_type: contentTypeStat
			});
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})()

});

/**
 * @swagger
 * /users/:user_id/projects:
 *   post:
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     description: Create a project
 *     parameters:
 *       - in: path
 *         name: user_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: name
 *         type: string
 *         schema:2
 *           type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Project
 */
router.post('/users/:user_id/projects',
	validateRequest({
		user_id: {
			notEmpty: true,
			errorMessage: "user_id required"
		},
		name: {
			notEmpty: true,
			errorMessage: "name is required"
		},
		description: {
			optional: true
		}
	}),
	function (req, res) {

	(async function () {

		try {

			let r = new ProjectRepository(req.app);
			// TODO validation
			let results = await r.createProject(
				req.body.name,
				req.body.description,
				req.params.user_id
			);
			res.send({message: "OK"});

		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();

});

/**
 * @swagger
 * /projects/:project_id:
 *   delete:
 *     description: Delete project
 *     parameters:
 *       - in: path
 *         name: project_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *     tags:
 *        - Project
 */
router.delete('/projects/:project_id',
	validateRequest({
		project_id: {
			notEmpty: true,
			errorMessage: "project_id required"
		}
	}),
	(req, res) => {

	(async function () {

		try {
			let r = new ProjectRepository(req.app);
			let results = await r.deleteProject(req.params.project_id);
			res.send({message: "OK"});

		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();

});

/**
 * @swagger
 * /projects/:project_id:
 *   patch:
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     description: Update project
 *     parameters:
 *       - in: path
 *         name: project_id
 *         type: string
 *         schema:
 *           type: string
 *         required: integer
 *       - in: formData
 *         name: name
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *     tags:
 *        - Project
 */
router.patch('/projects/:project_id',(req, res) => {

	(async function () {

		try {
			let r = new ProjectRepository(req.app);
			// TODO validation
			let results = await r.updateProject(
				req.params.project_id,
				req.body.name,
				req.body.description,
			);
			res.send({message: "OK"});

		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();
});

module.exports = router;