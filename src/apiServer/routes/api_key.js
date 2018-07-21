const express = require('express');
let router = express.Router();
const password = require('../lib/password');
const config = require('../../config');
const ApiKeyRespository = require('../repository/ApiKeyRespository');
const crypto = require('crypto');
const validateRequest = require('../middlewares/validateRequest');

/**
 * @swagger
 * /projects/:project_id/api_keys:
 *   get:
 *     description: Get api keys
 *     parameters:
 *       - in: path
 *         name: project_id
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
 *        - API Key
 */
router.get('/projects/:project_id/api_keys',
	validateRequest({
		project_id: {
			isInt: true,
			errorMessage: "project_id must be integer"
		}
	}),
	function (req, res) {

	(async function () {

		try {
			let r = new ApiKeyRespository(req.app);
			let results = await r.getApiKeys(req.params.project_id);
			res.send(results);
		} catch (e ) {
			res.status(500)
			res.send(e.message);
		}

	})()

});

/**
 * @swagger
 * /projects/:project_id/api_keys:
 *   post:
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     description: Create api key
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
 *         name: restriction_type
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: restriction_value
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - API Key
 */
router.post('/projects/:project_id/api_keys',
	validateRequest({
		project_id: {
			isInt: true,
			errorMessage: "project_id must be integer"
		},
		name: {
			isString: true,
			errorMessage: "name is required"
		},
		restriction_type: {
			isInt: true,
			errorMessage: "restriction_type must be integer"
		},
		restriction_value: {
			isString: true,
			errorMessage: "restriction_value is required"
		}
	}),
	function (req, res) {

	(async function () {

		try {

			let r = new ApiKeyRespository(req.app);
			// TODO validation
			let results = await r.createApiKey(
				req.params.project_id,
				req.body.name,
				crypto.randomBytes(32).toString('hex'),
				req.body.restriction_type,
				req.body.restriction_value
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
 * /api_keys/:api_key_id:
 *   get:
 *     description: Get api key
 *     parameters:
 *       - in: path
 *         name: api_key_id
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
 *        - API Key
 */
router.get('/api_keys/:api_key_id',
	validateRequest({
		api_key_id: {
			isInt: true,
			errorMessage: "api_key_id must be integer"
		}
	}),
	(req, res) => {

	(async function () {

		try {
			let r = new ApiKeyRespository(req.app);
			let results = await r.getApiKey(req.params.api_key_id);
			res.send(results);

		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();

});

/**
 * @swagger
 * /api_keys/:api_key_id:
 *   delete:
 *     description: Delete api key
 *     parameters:
 *       - in: path
 *         name: api_key_id
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
 *        - API Key
 */
router.delete('/api_keys/:api_key_id',
	validateRequest({
		api_key_id: {
			isInt: true,
			errorMessage: "api_key_id must be integer"
		}
	}),
	(req, res) => {

	(async function () {

		try {
			let r = new ApiKeyRespository(req.app);
			let results = await r.deleteApiKey(req.params.api_key_id);
			res.send({message: "OK"});

		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();

});

/**
 * @swagger
 * /api_keys/:api_key_id:
 *   patch:
 *     description: Update api key
 *     consumes:
 *       - application/x-www-form-urlencoded
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
 *         name: restriction_type
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: restriction_value
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - API Key
 */
router.patch('/api_keys/:api_key_id',
	validateRequest({
		api_key_id: {
			isInt: true,
			errorMessage: "api_key_id must be integer"
		},
		project_id: {
			isInt: true,
			errorMessage: "project_id must be integer"
		},
		name: {
			isString: true,
			errorMessage: "name is required"
		},
		restriction_type: {
			isInt: true,
			errorMessage: "restriction_type must be integer"
		},
		restriction_value: {
			isString: true,
			errorMessage: "restriction_value is required"
		}
	}),
	(req, res) => {

	(async function () {

		try {
			let r = new ApiKeyRespository(req.app);

			// TODO validation
			let results = await r.updateApiKey(
				req.params.api_key_id,
				req.body.name,
				req.body.key,
				req.body.restriction_type,
				req.body.restriction_value
			);
			res.send({message: "OK"});

		} catch (e) {
			res.status(500);
			res.send(e.message);
		}

	})();
});

module.exports = router;