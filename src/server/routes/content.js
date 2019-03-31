const express = require('express');
const ContentRepository = require('../repository/ContentRepository');
const validateRequest = require('../middlewares/validateRequest');

let router = express.Router();

/**
 *  TODO move this to module
 *
 * @param fqStr
 */
function parseFilterQuery(fqStr) {

	if(!fqStr) {
		return;
	}

	return fqStr.split(";").map((s) => {
		let t = s.split(":");
		return {
			k: t[0],
			v: t[1]
		}
	}).reduce((acc, curr) => {
		acc[curr.k] = curr.v;
		return acc;
	}, {})
}

/**
 * @swagger
 * /contents/{content_id}:
 *   get:
 *     description: Get single content
 *     parameters:
 *       - in: path
 *         name: content_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *     tags:
 *        - Content
 */
router.get('/contents/:content_id',
    validateRequest({
        content_id: {
            notEmpty: true,
            errorMessage: 'content_id required'
        }
    }),
    function (req, res) {

        (async function () {

            try {
                let r = new ContentRepository(req.app);
                let results = await r.getContent(req.params.content_id);
                res.send(results);
            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });

/**
 * @swagger
 * /content_types/{content_type_id}/contents:
 *   get:
 *     description: Get contents
 *     parameters:
 *       - in: path
 *         name: content_type_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: page
 *         type: integer
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort_by
 *         type: string
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort_dir
 *         type: string
 *         schema:
 *           type: string
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
            notEmpty: true,
            errorMessage: 'content_type_id required'
        }
    }),
    function (req, res) {

        (async function () {

		        let page = req.query.page || 1;
		        let sortBy = req.query.sort_by;
		        let sortDir = req.query.sort_dir || 'asc';
		        const PER_PAGE = 10;
		        let offset = (page*PER_PAGE) - PER_PAGE;
		        let max = PER_PAGE;

		        let filterObj = parseFilterQuery(req.query.fq);

            try {
                let r = new ContentRepository(req.app);
                // TODO validation to req.body
                let results = await r.getContents(req.params.content_type_id, offset, max, sortBy, sortDir, filterObj);
                let count = await r.getCount(req.params.content_type_id);
                res.set("DT-Data-Count", count);
                res.set("DT-Page-Number", page);
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
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: payload
 *         type: object
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: object
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
            notEmpty: true,
            errorMessage: 'content_type_id required'
        }
    }),
    function (req, res) {

        (async function () {

            try {
                let r = new ContentRepository(req.app);

                let results = await r.createContent(req.params.content_type_id, req.body.fields);
                res.send(results);
            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });


/**
 * @swagger
 * /contents/{content_id}:
 *   delete:
 *     description: Delete content
 *     parameters:
 *       - in: path
 *         name: content_id
 *         type: integer
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *     tags:
 *        - Content
 */
router.delete('/contents/:content_id',
    validateRequest({
        content_id: {
            notEmpty: true,
            errorMessage: 'content_id required'
        }
    }),
    (req, res) => {

        (async function () {

            try {
                let r = new ContentRepository(req.app);
                await r.deleteContent(req.params.content_id);
                res.send({message: 'OK'});

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });


/**
 * @swagger
 * /contents/{content_id}:
 *   patch:
 *     description: Delete content
 *     parameters:
 *       - in: path
 *         name: content_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: payload
 *         type: object
 *         schema:
 *           type: object
 *           properties:
 *             fields:
 *               type: array
 *     responses:
 *       200:
 *         description: success
 *     tags:
 *        - Content
 */
router.patch('/contents/:content_id',
    validateRequest({
        content_id: {
            notEmpty: true,
            errorMessage: 'content_id required'
        }
    }),
    (req, res) => {

        (async function () {

            try {
                let r = new ContentRepository(req.app);
                await r.updateContent(req.params.content_id, req.body);
                res.send({message: 'OK'});

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });

module.exports = router;