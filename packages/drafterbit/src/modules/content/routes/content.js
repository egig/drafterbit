const express = require('express');
const validateRequest = require('@drafterbit/common/middlewares/validateRequest');
const FilterQuery = require( '@drafterbit/common/FilterQuery');
const contentMiddleware = require('../middlewares/content');
const handleFunc = require('@drafterbit/common/handleFunc');

let router = express.Router();

/**
 * @swagger
 * /{type_name}/{id}:
 *   delete:
 *     description: Delete contents
 *     parameters:
 *       - in: path
 *         name: type_name
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
router.delete('/:type_name/:id',
    validateRequest({
        type_name: {
            notEmpty: true,
            errorMessage: 'slug required'
        },
        id: {
            notEmpty: true,
            errorMessage: 'id required'
        },
    }),
    contentMiddleware(),
    handleFunc(async function(req) {
        let  Model = req.app.model(req.params['type_name']);
        return await Model.findOneAndDelete({_id: req.params.id });
    })
);


/**
 * @swagger
 * /{type_name}/{id}:
 *   get:
 *     description: Get content
 *     parameters:
 *       - in: path
 *         name: type_name
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
router.get('/:type_name/:id',
    validateRequest({
        type_name: {
            notEmpty: true,
            errorMessage: 'slug required'
        },
        id: {
            notEmpty: true,
            errorMessage: 'id required'
        },
    }),
    contentMiddleware(),
    handleFunc(async function(req) {
        let typeName = req.params['type_name'];
        let  Model = req.app.model(typeName);
        let selectFields = ['-__v'];
        req.app._modules.map(m => {
            if (!!m.selectFields) {
                selectFields = m.selectFields[typeName];
            }
        });
        return Model.findOne({_id: req.params.id }).select(selectFields).exec();
    })
);

/**
 * @swagger
 * /{type_name}/{id}:
 *   patch:
 *     description: Update contents
 *     parameters:
 *       - in: path
 *         name: type_name
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
router.patch('/:type_name/:id',
    validateRequest({
        type_name: {
            notEmpty: true,
            errorMessage: 'slug required'
        },
        id: {
            notEmpty: true,
            errorMessage: 'id required'
        },
    }),
    contentMiddleware(),
    handleFunc(async function(req) {
        let  Model = req.app.model(req.params.type_name);
        return await Model.findOneAndUpdate({_id: req.params.id }, req.body);
    })    
);

/**
 * @swagger
 * /{type_name}:
 *   post:
 *     description: Create contents
 *     parameters:
 *       - in: path
 *         name: type_name
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
router.post('/:type_name',
    validateRequest({
        type_name: {
            notEmpty: true,
            errorMessage: 'type_name required'
        }
    }),
    contentMiddleware(),
    handleFunc(async function(req) {
        let  Model = req.app.model(req.params.type_name);

        // TODO add filter here, e.g to hash password field
        let item = await Model.create(req.body);
        return {
            message: 'created',
            item
        };
    })
);


/**
 * @swagger
 * /{type_name}:
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
 *        - /{type_name}
 */
router.get('/:type_name',
    validateRequest({
        type_name: {
            notEmpty: true,
            errorMessage: 'type_name required'
        }
    }),
    contentMiddleware(),
    handleFunc(async function(req, res) {

        let page = req.query.page || 1;
        let sortBy = req.query.sort_by;
        let sortDir = req.query.sort_dir || 'asc';
        const PER_PAGE = 10;
        let offset = (page*PER_PAGE) - PER_PAGE;
        let max = PER_PAGE;

        let filterObj = FilterQuery.fromString(req.query.fq).toMap();
        let typeName = req.params['type_name'];
        let m = req.app.model(req.params['type_name']);

        let selectFields = ['-__v'];
        req.app._modules.map(m => {
            if (!!m.selectFields) {
                selectFields = m.selectFields[typeName];
            }
        });

        let sortD = sortDir === 'asc' ? 1 : -1;

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
        }).select(selectFields).skip(offset).limit(max);

        req.lookupFields.forEach(f => {
            query.populate({
                path: f.name,
                select: '-__v',
                options: { limit: 5 }
            });
        });

        let results = await query.exec();

        // TODO add filter here, e.g to decode password field
        let dataCount = await m.find(matchRule).estimatedDocumentCount();
        res.set('Content-Range',`resources ${offset}-${offset+PER_PAGE - (PER_PAGE-dataCount)}/${dataCount}`);
        res.send(results);
    })
);

module.exports = router;