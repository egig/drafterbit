const express = require('express');
const ApiRepository = require('../repository/ApiRepository');
const ContentTypeRepository = require('../repository/ContentTypeRepository');
const ContentRepository = require('../repository/ContentRepository');
const validateRequest = require('../middlewares/validateRequest');

let router = express.Router();


/**
 * @swagger
 * /{slug}:
 *   get:
 *     description: Get contents
 *     parameters:
 *       - in: path
 *         name: slug
 *         type: strimg
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content
 */
router.get('/:slug',
	validateRequest({
		slug: {
			notEmpty: true,
			errorMessage: 'slug required'
		}
	}),
	function (req, res, next) {

	let r = new ContentTypeRepository();
	r.getContentType(req.params.slug)
		.then(contentType => {
			if(!contentType) {
				return res.status('404').send("Not Found");
			}

			req.contentType = contentType;

			next();
		});
	},
	function (req, res) {

		(async function () {

			try {
				let r = new ContentRepository(req.app);
				let results = await r.getContents(req.contentType.id);
				res.send(results);
			} catch (e ) {
				res.status(500);
				res.send(e.message);
			}

		})();
	});

module.exports = router;