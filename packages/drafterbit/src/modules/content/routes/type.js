const express = require('express');
const validateRequest  = require('@drafterbit/common/middlewares/validateRequest');
const handleFunc = require('@drafterbit/common/handleFunc');

let router = express.Router();

/**
 * @swagger
 * /types/{type_id}:
 *   get:
 *     description: Get content type
 *     parameters:
 *       - in: path
 *         name: type_id
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
 *        - /types
 */
router.get('/types/:type_id',
    validateRequest({
        type_id: {
            notEmpty: true,
            errorMessage: 'type_id is required'
        }
    }),
    handleFunc(async (req) => {
        let m = req.app.model('Type');
        return await m.getContentType(req.params.type_id);
    })
);


/**
 * @swagger
 * /types:
 *   get:
 *     description: Get content types
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /types
 */
router.get('/types', handleFunc(async (req) => {
    let m = req.app.model('Type');
    return await m.getContentTypes();
}));

/**
 * @swagger
 * /types:
 *   post:
 *     consumes:
 *       - application/json
 *     description: Create content type
 *     parameters:
 *       - in: body
 *         name: type
 *         schema:
 *           type: object
 *           required:
 *              - name
 *           properties:
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *             description:
 *               type: string
 *             fields:
 *               type: array
 *               properties:
 *                 type_id:
 *                   type: int
 *                 label:
 *                   type: string
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /types
 */
router.post('/types',
    validateRequest({
        name: {
            notEmpty: true,
            errorMessage: 'name is required'
        },
        slug: {
            notEmpty: true,
            errorMessage: 'slug is required'
        },
        description: {
            optional: true,
            isString: true,
            errorMessage: 'description must be string'
        },
        fields: {
            isArray: true,
            errorMessage: 'fields must be array'
        }
    }),
    handleFunc(async function(req) {
        let m = req.app.model('Type');
        return await m.createContentType(req.body.name, req.body.slug,
            req.body.description, req.body.fields);
    })
);

/**
 * @swagger
 * /types/{type_id}/fields:
 *   post:
 *     consumes:
 *       - application/json
 *     description: Create content type
 *     parameters:
 *       - in: path
 *         name: type_id
 *         type: string
 *         required: true
 *       - in: body
 *         name: field
 *         schema:
 *           type: object
 *           required:
 *              - name
 *              - label
 *              - type_id
 *           properties:
 *             name:
 *               type: string
 *             label:
 *               type: string
 *             type_id:
 *               type: number
 *             related_content_type_slug:
 *               type: string
 *             validation_rules:
 *               type: string
 *
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /types
 */
router.post('/types/:type_id/fields',
    validateRequest({
    }),
    handleFunc(async function(req) {
        let m = req.app.model('Type');
        let contentTypeId = req.params['type_id'];
        let s = await m.addField(contentTypeId, req.body);

        // update compiled models
        let contentType = await  m.getContentType(contentTypeId);
        delete req.app.getDB().models[contentType.slug];

        return s;
    })
);

/**
 * @swagger
 * /types/:type_id:
 *   delete:
 *     description: Delete content type
 *     parameters:
 *       - in: query
 *         name: type_id
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
 *        - /types
 */
router.delete('/types/:type_id',
    validateRequest({
        type_id: {
            notEmpty: true,
            errorMessage: 'type_id required'
        }
    }),
    handleFunc(async function(req) {
        let m = req.app.model('Type');
        return m.deleteContentType(req.params.type_id);
    })
);

/**
 * @swagger
 * /types/{type_id}:
 *   patch:
 *     consumes:
 *       - application/json
 *     description: Update content type
 *     parameters:
 *       - in: path
 *         name: type_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: type
 *         schema:
 *           type: object
 *           required:
 *              - name
 *           properties:
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *             description:
 *               type: string
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /types
 */
router.patch('/types/:type_id',
    validateRequest({
        type_id: {
            notEmpty: true,
            errorMessage: 'type_id is required'
        },
        name: {
            optional: true,
            errorMessage: 'name is required'
        },
        slug: {
            optional: true,
            errorMessage: 'slug is required'
        },
        description: {
            optional: true,
            errorMessage: 'description must be string'
        },
    }),
    handleFunc(async function(req) {
        let m = req.app.model('Type');
        let contentTypeId = req.params.type_id;

        let s =  await m.updateContentType(contentTypeId, req.body);

        // update compiled models
        let contentType = await  m.getContentType(contentTypeId);
        delete req.app.getDB().models[contentType.slug];

        return s;
    })
);


/**
 * @swagger
 * /types/{type_id}/fields/{field_id}:
 *   patch:
 *     consumes:
 *       - application/json
 *     description: Update content type
 *     parameters:
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: type_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: field_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: payload
 *         type: object
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /types
 */
router.patch('/types/:type_id/fields/:field_id',
    validateRequest({
        type_id: {
            notEmpty: true,
            errorMessage: 'type_id is required'
        },
        name: {
            optional: true,
            errorMessage: 'name is required'
        },
        slug: {
            optional: true,
            errorMessage: 'slug is required'
        },
        description: {
            optional: true,
            errorMessage: 'description must be string'
        },
    }),
    handleFunc(async function(req) {
        let contentTypeId = req.params['type_id'];
        let fieldId = req.params['field_id'];
        let m = req.app.model('Type');
        let s = await m.updateContentTypeField(contentTypeId, fieldId, req.body);

        delete req.app.getDB().models[contentTypeId];

        return s;
    })
);

module.exports =  router;