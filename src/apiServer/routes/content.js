const express = require('express');
const config = require('../../config');
const ContentRepository = require('../repository/ContentRepository');
const validateRequest = require('../middlewares/validateRequest');

let router = express.Router();

/**
 * @swagger
 * /content_types/:content_type_id/contents:
 *   get:
 *     description: Get contents
 *     parameters:
 *       - in: path
 *         name: content_type_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content
 */
router.get('/content_types/:content_type_id/contents',
	validateRequest({
		content_type_id: {
			isInt: true,
			errorMessage: "content_type_id must be integer"
		}
	}),
	function (req, res) {

	(async function () {

		try {
			let r = new ContentRepository(req.app);
			// TODO validation to req.body
			let results = await r.getContents(req.params.content_type_id);
			res.send(results);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();
});

/**
 * @swagger
 * /content_types/:content_type_id/contents:
 *   post:
 *     consumes:
 *       - application/json
 *     description: Create content
 *     parameters:
 *       - in: path
 *         name: content_type_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *       - in: body
 *         name: content
 *         type: object
 *         schema:
 *           type: object
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content
 */
router.post('/content_types/:content_type_id/contents',
	validateRequest({
		content_type_id: {
			isInt: true,
			errorMessage: "content_type_id must be integer"
		},
		content: {
			isObject: true,
			errorMessage: "name is required"
		}
	}),
	function (req, res) {

	(async function () {

		try {
			let r = new ContentRepository(req.app);
			// TODO validation to req.body
			let results = await r.createContent(req.params.content_type_id, JSON.stringify(req.body.content));
			res.send(results);
		} catch (e ) {
			res.status(500);
			res.send(e.message);
		}

	})();

});

module.exports = router;