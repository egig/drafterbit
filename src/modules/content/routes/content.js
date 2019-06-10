const express = require('express');
const validateRequest  = require('../../../middlewares/validateRequest');
const { parseFilterQuery }  = require('../../../common/parseFilterQuery');

let router = express.Router();

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
                let m = req.app.model('@content/Content');
                let results = await m.getContent(req.params.content_id);
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
                let m = req.app.model('@content/Content');
                // TODO validation to req.body
                let results = await m.getContents(req.params.content_type_id, offset, max, sortBy, sortDir, filterObj);
                let count = await m.getCount(req.params.content_type_id,  filterObj);
                res.set('DT-Data-Count', count);
                res.set('DT-Page-Number', page);
                res.send(results);
            } catch (e ) {
                res.status(500);
                req.app.get('log').error(e);
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
                let m = req.app.model('@content/Content');
                let results = await m.createContent(req.params.content_type_id, req.body.fields);
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
                let m = req.app.model('@content/Content');
                await m.deleteContent(req.params.content_id);
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
                let m = req.app.model('@content/Content');
                await m.updateContent(req.params.content_id, req.body);
                res.send({message: 'OK'});

            } catch (e ) {
                res.status(500);
                res.send(e.message);
            }

        })();

    });

module.exports =  router;