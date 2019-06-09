import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import fieldsToSchema from '../../../fieldsToSchema';
import {FIELD_RELATION_TO_MANY, FIELD_RELATION_TO_ONE} from '../../../fieldTypes';
import { parseFilterQuery } from '../../../common/parseFilterQuery';

let router = express.Router();

function getSchema(fields) {
    let fieldsObj = {};
    fields.forEach(f => {

        if (f.type_id === FIELD_RELATION_TO_MANY) {
            fieldsObj[f.name] = [{
                type: f.type_id,
                ref: f.related_content_type_id
            }];

        } else if (f.type_id === FIELD_RELATION_TO_ONE) {

            fieldsObj[f.name] = {
                type: f.type_id,
                ref: f.related_content_type_id
            };

        } else {
            fieldsObj[f.name] = {
                type: f.type_id
            };
        }
    });

    return fieldsToSchema.convert(fieldsObj);
}


function contentTypeMiddleware() {
    return function (req, res, next) {

        let m = req.app.model('@content/ContentType');
        m.getContentType(req.params.slug)
            .then(contentType => {
                if(!contentType) {
                    return res.status('404').send('Not Found');
                }

                // extract other contentTypes
                let relatedContentTypes = [];
                contentType.fields.forEach(f => {
                    if ((f.type_id === FIELD_RELATION_TO_MANY) || (f.type_id === FIELD_RELATION_TO_ONE)) {
                        relatedContentTypes.push(f.related_content_type_id);
                    }
                });

                let ctPromises = relatedContentTypes.map(ctSlug => {
                    return m.getContentType(ctSlug)
                        .then(ct => {
                            return {
                                name: ctSlug,
                                schemaObj: getSchema(ct.fields)
                            };
                        });
                });

                Promise.all(ctPromises)
                    .then(rList => {

                        rList.map(function (ct) {
                            try {
                                req.app.get('db').model(ct.name);
                            } catch (error) {
                                req.app.get('db').model(ct.name, ct.schemaObj);
                            }
                        });
                    });

                let schemaObj = getSchema(contentType.fields);
                try {
                    req.app.get('db').model(contentType.slug);
                } catch (error) {
                    req.app.get('db').model(contentType.slug, schemaObj);
                }

                req.contentType = contentType;

                next();
            });
    };
}

/**
 * @swagger
 * /{slug}/{id}:
 *   delete:
 *     description: Delete contents
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
 *        - Content
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
    contentTypeMiddleware(),
    function (req, res) {

        (async function () {

            try {
                let  Model = req.app.get('db').model(req.contentType.slug);

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
 *        - Content
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
    contentTypeMiddleware(),
    function (req, res) {

        (async function () {

            try {
                let  Model = req.app.get('db').model(req.contentType.slug);

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
 *        - Content
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
    contentTypeMiddleware(),
    function (req, res) {

        (async function () {

            try {
                let  Model = req.app.get('db').model(req.contentType.slug);
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
 *         required: true
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - Content
 */
router.post('/:slug',
    validateRequest({
        slug: {
            notEmpty: true,
            errorMessage: 'slug required'
        }
    }),
    contentTypeMiddleware(),
    function (req, res) {

        (async function () {

            try {
                let  Model = req.app.get('db').model(req.contentType.slug);

                Model.create(req.body, function (err, item) {
                    if (err) return res.status(500).send(err.message);
                    res.send({
                        message: 'created',
                        item
                    });
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
 *        - Content
 */
router.get('/:slug',
    validateRequest({
        slug: {
            notEmpty: true,
            errorMessage: 'slug required'
        }
    }),
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
                let m = req.app.get('db').model(req.contentType.slug);

                let sortD = sortDir == 'asc' ? 1 : -1;

                let agg = [];

                if(filterObj) {

                    let matchRule = {};
                    Object.keys(filterObj).forEach((k) => {
                        matchRule[k] = {
                            $regex: `.*${filterObj[k]}.*`
                        };
                    });
                    agg.push({$match: matchRule});
                }

                let countAgg = [...agg];
                countAgg.push({$count: 'content_count'});

                if(!!sortBy && sortBy !== '_id') {
                    agg.push({
                        $sort: {
                            [sortBy]: sortD
                        }
                    });
                } else {
                    agg.push({$sort: {'_id': sortD}});
                }

                agg.push({$skip: offset});
                agg.push({$limit: max});

                let results = await m.aggregate(agg).exec();
                let countResults = await m.aggregate(countAgg).exec();
                let dataCount = countResults[0] ? countResults[0].content_count : 0;
                res.set('DT-Data-Count',dataCount);
                res.set('DT-Page-Number', page);
                res.send(results);
            } catch (e) {
                req.app.get('log').error(e);
                res.status(500);
                res.send(e.message);
            }

        })();
    });

export default router;