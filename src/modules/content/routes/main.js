const express = require('express');
const validateRequest = require('../../../middlewares/validateRequest');
const { parseFilterQuery } = require( '../../../common/parseFilterQuery');
const { FIELD_NUMBER,
    FIELD_RELATION_TO_ONE,
    FIELD_RELATION_TO_MANY,
    FIELD_RICH_TEXT,
    FIELD_LONG_TEXT,
    FIELD_SHORT_TEXT,
    FIELD_UNSTRUCTURED,
    getFieldTypes } = require( '../../../fieldTypes');
const {
    projectMiddleware,
    contentTypeMiddleware
} = require('../../../middlewares/content');

let router = express.Router();

/**
 * @swagger
 * /field_types:
 *   get:
 *     description: Get Supported Field Types
 *     responses:
 *       200:
 *         description: success
 */
router.get("/field_types", function (req, res) {
    res.send({
        field_types: getFieldTypes(),
        __constants: `window.__DT_CONST = {
        FIELD_NUMBER: ${FIELD_NUMBER},
        FIELD_RELATION_TO_ONE: ${FIELD_RELATION_TO_ONE},
        FIELD_RELATION_TO_MANY: ${FIELD_RELATION_TO_MANY},
        FIELD_RICH_TEXT: ${FIELD_RICH_TEXT},
        FIELD_LONG_TEXT: ${FIELD_LONG_TEXT},
        FIELD_SHORT_TEXT: ${ FIELD_SHORT_TEXT },
        FIELD_UNSTRUCTURED: ${ FIELD_UNSTRUCTURED },
        }`
    });
});

/**
 * @swagger
 * /projects/{project_slug}/content_types/{slug}/{id}:
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
router.delete('/projects/:project_slug/entries/:slug/:id',
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
    projectMiddleware(),
    contentTypeMiddleware(),
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
 * /projects/{project_slug}/entries/{slug}/{id}:
 *   get:
 *     description: Get content
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
router.get('/projects/:project_slug/entries/:slug/:id',
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
    projectMiddleware(),
    contentTypeMiddleware(),
    function (req, res) {

        (async function () {

            try {
                let projectSlug =  req.params['project_slug'];
                let  Model = req.app.getDB(projectSlug).model(req.contentType.slug);

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
 * /projects/{project_slug}/entries/{slug}/{id}:
 *   patch:
 *     description: Update contents
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
router.patch('/projects/:project_slug/entries/:slug/:id',
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
    projectMiddleware(),
    contentTypeMiddleware(),
    function (req, res) {

        (async function () {

            try {
                let projectSlug =  req.params['project_slug'];
                let  Model = req.app.getDB(projectSlug).model(req.contentType.slug);
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
 * /projects/{project_slug}/content_types/{slug}:
 *   post:
 *     description: Create contents
 *     parameters:
 *       - in: path
 *         name: project_slug
 *         type: string
 *         schema:
 *           type: string
 *         required: true
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
router.post('/projects/:project_slug/content_types/:slug',
    validateRequest({
        slug: {
            notEmpty: true,
            errorMessage: 'slug required'
        }
    }),
    projectMiddleware(),
    contentTypeMiddleware(),
    function (req, res) {

        (async function () {

        	let projectSlug = req.param('project_slug');

            try {
                let  Model = req.app.getDB(projectSlug).model(req.contentType.slug);

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
 * /projects/{project_slug}/entries/{slug}:
 *   get:
 *     description: Get contents
 *     parameters:
 *       - in: path
 *         name: project_slug
 *         type: string
 *         schema:
 *           type: string
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
 *        - /{slug}
 */
router.get('/projects/:project_slug/entries/:slug',
    validateRequest({
        slug: {
            notEmpty: true,
            errorMessage: 'slug required'
        }
    }),
    projectMiddleware(),
    contentTypeMiddleware(),
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
                let projectSlug = req.params['project_slug'];
                let conn = req.app.getDB(projectSlug);

                let m = conn.model(req.params['slug']);

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