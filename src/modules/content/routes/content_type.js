const express = require('express');
const validateRequest  = require('../../../middlewares/validateRequest');
const handleFunc = require('../../../handleFunc');

let router = express.Router();

/**
 * @swagger
 * /content_types/{content_type_id}:
 *   get:
 *     description: Get content type
 *     parameters:
 *       - in: path
 *         name: project_slug
 *         required: true
 *       - in: path
 *         name: content_type_id
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
 *        - /content_types
 */
router.get('/content_types/:content_type_id',
    validateRequest({
        content_type_id: {
            notEmpty: true,
            errorMessage: 'content_type_id is required'
        }
    }),
    handleFunc(async (req) => {
        let m = req.app.model('ContentType');
        return await m.getContentType(req.params.content_type_id);
    })
);


/**
 * @swagger
 * /content_types:
 *   get:
 *     description: Get content types
 *     responses:
 *       200:
 *         description: success
 *
 *     tags:
 *        - /content_types
 */
router.get('/content_types', handleFunc(async (req) => {
    let m = req.app.model('ContentType');
    return await m.getContentTypes();
}));

/**
 * @swagger
 * /content_types:
 *   post:
 *     consumes:
 *       - application/json
 *     description: Create content type
 *     parameters:
 *       - in: body
 *         name: content_type
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
 *        - /content_types
 */
router.post('/content_types',
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
        let m = req.app.model('ContentType');
        return await m.createContentType(req.body.name, req.body.slug,
            req.body.description, req.body.fields);
    })
);

/**
 * @swagger
 * /content_types/{content_type_id}/fields:
 *   post:
 *     consumes:
 *       - application/json
 *     description: Create content type
 *     parameters:
 *       - in: path
 *         name: content_type_id
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
 *        - /content_types
 */
router.post('/projects/:project_slug/content_types/:content_type_id/fields',
    validateRequest({
    }),
    handleFunc(async function(req) {
        let contentTypeId = req.params['content_type_id'];
        return await m.addField(contentTypeId, req.body);        
    })
);

/**
 * @swagger
 * /content_types/:content_type_id:
 *   delete:
 *     description: Delete content type
 *     parameters:
 *       - in: query
 *         name: content_type_id
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
 *        - /content_types
 */
router.delete('/content_types/:content_type_id',
    validateRequest({
        content_type_id: {
            notEmpty: true,
            errorMessage: 'content_type_id required'
        }
    }),
    handleFunc(async function(req) {
        let m = req.app.model('ContentType');
        return await m.deleteContentType(req.params.content_type_id);
    })
);

/**
 * @swagger
 * /projects/{project_slug}/content_types/{content_type_id}:
 *   patch:
 *     consumes:
 *       - application/json
 *     description: Update content type
 *     parameters:
 *       - in: path
 *         name: content_type_id
 *         type: string
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: content_type
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
 *        - /content_types
 */
router.patch('/content_types/:content_type_id',
    validateRequest({
        content_type_id: {
            notEmpty: true,
            errorMessage: 'content_type_id is required'
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
        let m = req.app.model('ContentType');
        return await m.updateContentType(req.params.content_type_id, req.body);
        // update compiled models
        // TODO ensure this relieable methods
        // req.app.getDB(req._dbName).models = {};
    })
);


/**
 * @swagger
 * /content_types/{content_type_id}/fields/{field_id}:
 *   patch:
 *     consumes:
 *       - application/json
 *     description: Update content type
 *     parameters:
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: content_type_id
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
 *        - /content_types
 */
router.patch('/content_types/:content_type_id/fields/:field_id',
    validateRequest({
        content_type_id: {
            notEmpty: true,
            errorMessage: 'content_type_id is required'
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
        let contentTypeId = req.params['content_type_id'];
        let fieldId = req.params['field_id'];
        let m = req.app.model('ContentType');
        return await m.updateContentTypeField(contentTypeId, fieldId, req.body);

        // update compiled models
        // TODO ensure this relieable methods
        // req.app.getDB(req._dbName).models = {};
    })
);

module.exports =  router;