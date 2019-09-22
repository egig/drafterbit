const express = require('express');
const validateRequest = require('../../../middlewares/validateRequest');
const { parseFilterQuery } = require( '../../../filterQuery');
const { FIELD_NUMBER,
    FIELD_RELATION_TO_ONE,
    FIELD_RELATION_TO_MANY,
    FIELD_RICH_TEXT,
    FIELD_LONG_TEXT,
    FIELD_SHORT_TEXT,
    FIELD_UNSTRUCTURED,
    getFieldTypes } = require( '../../../fieldTypes');
const contentMiddleware = require('../middlewares/content');

let router = express.Router();

/**
 * @swagger
 * /{slug}/{id}:
 *   delete:
 *     description: Delete contents
 *     parameters:
 *       - in: path
 *         name: project_slug
 *         required: true
 *       - in: path
 *         name: slug
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /{slug}
 */
router.delete('/:slug/:id',
    validateRequest({
        slug: {
            notEmpty: true,
            errorMessage: 'slug required'
        },
        id: {
            notEmpty: true,
            errorMessage: 'id required'
        },
    }),
    contentMiddleware(),
    function (req, res) {

        (async function () {

            try {

                let projectSlug =  req.params['project_slug'];
                let  Model = req.app.getDB(projectSlug).model(req.params['slug']);

                let item = await Model.findOneAndDelete({_id: req.params.id });
                res.send(item);

            } catch (e) {
                req.app.get('log').error(e);
                res.status(500);
                res.send(e.message);
            }

        })();
    });


/**
 * @swagger
 * /{slug}/{id}:
 *   get:
 *     description: Get content
 *     parameters:
 *       - in: path
 *         name: slug
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /{slug}
 */
router.get('/:slug/:id',
    validateRequest({
        slug: {
            notEmpty: true,
            errorMessage: 'slug required'
        },
        id: {
            notEmpty: true,
            errorMessage: 'id required'
        },
    }),
    contentMiddleware(),
    function (req, res) {

        (async function () {

            try {
                let  Model = req.model(req.contentType.slug);

                let item = await Model.findOne({_id: req.params.id });
                res.send(item);

            } catch (e) {
                req.app.get('log').error(e);
                res.status(500);
                res.send(e.message);
            }

        })();
    });

/**
 * @swagger
 * /{slug}/{id}:
 *   patch:
 *     description: Update contents
 *     parameters:
 *       - in: path
 *         name: slug
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /{slug}
 */
router.patch('/:slug/:id',
    validateRequest({
        slug: {
            notEmpty: true,
            errorMessage: 'slug required'
        },
        id: {
            notEmpty: true,
            errorMessage: 'id required'
        },
    }),
    contentMiddleware(),
    function (req, res) {

        (async function () {

            try {
                let  Model = req.model(req.contentType.slug);
                let item = await Model.findOneAndUpdate({_id: req.params.id }, req.body);
                res.send(item);

            } catch (e) {
                req.app.get('log').error(e);
                res.status(500);
                res.send(e.message);
            }

        })();
    });

/**
 * @swagger
 * /{slug}:
 *   post:
 *     description: Create contents
 *     parameters:
 *       - in: path
 *         name: slug
 *         type: string
 *         schema:
 *           type: string
 *       - in: body
 *         name: payload
 *         type: object
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /{slug}
 */
router.post('/:slug',
    validateRequest({
        slug: {
            notEmpty: true,
            errorMessage: 'slug required'
        }
    }),
    contentMiddleware(),
    function (req, res) {

        (async function () {

            try {
                let  Model = req.model(req.contentType.slug);

                let item = await Model.create(req.body);
		            res.send({
			            message: 'created',
			            item
		            });

            } catch (e) {
                req.app.get('log').error(e);
                res.status(500);
                res.send(e.message);
            }

        })();
    });


/**
 * @swagger
 * /{slug}:
 *   get:
 *     description: Get contents
 *     parameters:
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
 *        - /{slug}
 */
router.get('/:slug',
    validateRequest({
        slug: {
            notEmpty: true,
            errorMessage: 'slug required'
        }
    }),
    contentMiddleware(),
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

                let m = req.model(req.params['slug']);

                let sortD = sortDir == 'asc' ? 1 : -1;

                let matchRule = {};
                if(filterObj) {
                    Object.keys(filterObj).forEach((k) => {
                        matchRule[k] = {
                            $regex: `.*${filterObj[k]}.*`
                        };
                    });
                }


                let sortObj;
                if(!!sortBy && sortBy !== '_id') {
                    sortObj = {
                        [sortBy]: sortD
                    };
                } else {
                    sortObj = {'_id': sortD};
                }

                let query = m.find(matchRule, null, {
                    sort: sortObj
                }).select(['-__v']).skip(offset).limit(max);

                req.lookupFields.forEach(f => {
                    query.populate({
                        path: f.name,
                        select: '-__v',
                        options: { limit: 5 }
                    });
                });

                let results = await query.exec();

                let dataCount = await m.find(matchRule).estimatedDocumentCount();
                res.set('Content-Range',`resources ${offset}-${offset+PER_PAGE - (PER_PAGE-dataCount)}/${dataCount}`);
                res.send(results);
            } catch (e) {
                req.app.get('log').error(e);
                res.status(500);
                res.send(e.message);
            }

        })();
    });

module.exports = router;