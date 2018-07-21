const express = require('express');
const config = require('../../config');
const ContentTypeRepository = require('../repository/ContentTypeRepository');
const validateRequest = require('../middlewares/validateRequest');

let router = express.Router();

/**
 * @swagger
 * /content_types/:content_type_id:
 *   get:
 *     description: Get content type
 *     parameters:
 *       - in: path
 *         name: content_type_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content Type
 */
router.get('/content_types/:content_type_id',
	validateRequest({
		content_type_id: {
			isInt: true,
			errorMessage: "content_type_id must be integer"
		}
	}),
	function (req, res) {
	(async function () {

		try {
			let r = new ContentTypeRepository(req.app);
			let results = await r.getContentType(req.params.content_type_id);
			res.send(results);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})()
});


/**
 * @swagger
 * /projects/:project_id/content_types:
 *   get:
 *     description: Get content types
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
 *
 *     tags:
 *        - Content Type
 */
router.get('/projects/:project_id/content_types',
	validateRequest({
		project_id: {
			isInt: true,
			errorMessage: "project_id must be integer"
		}
	}),
	function (req, res) {
	(async function () {

		try {
			let r = new ContentTypeRepository(req.app);
			let results = await r.getContentTypes(req.params.project_id);
			res.send(results);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})()
});

/**
 * @swagger
 * /projects/:project_id/content_types/:slug:
 *   get:
 *     description: Get content type by slug
 *     parameters:
 *       - in: path
 *         name: project_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: slug
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content Type
 */
router.get('/projects/:project_id/content_types/:slug',
	validateRequest({
		project_id: {
			isInt: true,
			errorMessage: "project_id must be integer"
		},
		slug: {
			isString: true,
			errorMessage: "slug is required"
		}
	}),
	function (req, res) {
	(async function () {

		try {
			let r = new ContentTypeRepository(req.app);
			let result = await r.getContentTypeFields(req.params.project_id, req.params.slug);
			res.send(result);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})()
});


/**
 * @swagger
 * /projects/:project_id/content_types:
 *   post:
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     description: Create content type
 *     parameters:
 *       - in: path
 *         name: project_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *       - in: formData
 *         name: name
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: slug
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         schema:
 *           type: string
 *         required: false
 *       - in: body
 *         name: fields
 *         type: array
 *         schema:
 *           type: array
 *         required: true
 *
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content Type
 */
router.post('/projects/:project_id/content_types',
	validateRequest({
		project_id: {
			isInt: true,
			errorMessage: "project_id must be integer"
		},
		name: {
			notEmpty: true,
			errorMessage: "name is required"
		},
		slug: {
			notEmpty: true,
			errorMessage: "slug is required"
		},
		description: {
			optional: true,
			isString: true,
			errorMessage: "description must be string"
		},
		fields: {
			isArray: true,
			errorMessage: "fields must be array"
		}
	}),
	function (req, res) {

	(async function () {

		try {
			let r = new ContentTypeRepository(req.app);
			let results = await r.createContentType(req.body.name, req.body.slug,
				req.body.description, req.params.project_id, req.body.fields);
			res.send(results);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();

});

/**
 * @swagger
 * /content_types/:content_type_id:
 *   delete:
 *     description: Delete content type
 *     parameters:
 *       - in: query
 *         name: content_type_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content Type
 */
router.delete('/content_types/:content_type_id',
	validateRequest({
		content_type_id: {
			isInt: true,
			errorMessage: "content_type_id must be integer"
		}
	}),
	function (req, res) {

	(async function () {

		try {
			let r = new ContentTypeRepository(req.app);
			let results = await r.deleteContentType(req.params.content_type_id);
			res.send(results);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();

});

/**
 * @swagger
 * /projects/:project_id/content_types:
 *   patch:
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     description: Update content type
 *     parameters:
 *       - in: formData
 *         name: name
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: slug
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         schema:
 *           type: string
 *         required: false
 *
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content Type
 */
router.patch('/content_types/:content_type_id',
	validateRequest({
		content_type_id: {
			isInt: true,
			errorMessage: "content_type_id must be integer"
		},
		name: {
			isString: true,
			errorMessage: "name is required"
		},
		slug: {
			isString: true,
			errorMessage: "slug is required"
		},
		description: {
			optional: true,
			isString: true,
			errorMessage: "description must be string"
		},
	}),
	function (req, res) {

	(async function () {


		try {
			let r = new ContentTypeRepository(req.app);
			// TODO validation
			let results = await r.updateContentType(req.params.content_type_id, req.body.name, req.body.slug, req.body.description);
			res.send(results);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();

});

module.exports = router;