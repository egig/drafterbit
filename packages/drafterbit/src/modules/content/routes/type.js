const express = require('express');
const validateRequest  = require('@drafterbit/common/middlewares/validateRequest');
const handleFunc = require('@drafterbit/common/handleFunc');
const FilterQuery = require('@drafterbit/common/FilterQuery');

let router = express.Router();

/**
 * @swagger
 * /types/{type_name}:
 *   get:
 *     description: Get content type
 *     parameters:
 *       - in: path
 *         name: type_name
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
router.get('/types/:type_name',
    validateRequest({
        type_name: {
            notEmpty: true,
            errorMessage: 'type_id is required'
        }
    }),
    handleFunc(async (req) => {
        let m = req.app.model('Type');
        return await m.getType(req.params.type_name);
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
    let fq = FilterQuery.fromString(req.query.fq);
    return await m.getTypes(fq.toMap());
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
        display_text: {
            notEmpty: true,
            errorMessage: 'display_text is required'
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
    handleFunc(async function  (req) {
        let m = req.app.model('Type');

        let fields = [
            {
                name: 'status',
                type_name: 'Number',
                display_text: 'Status',
                show_in_form: false,
                show_in_list: false
            },
            {
                name: 'published_at',
                type_name: 'Number',
                display_text: 'Create At',
                show_in_form: false,
                show_in_list: false
            },
            {
                name: 'created_at',
                type_name: 'Number',
                display_text: 'Create At',
                show_in_form: false,
                show_in_list: false
            },
            {
                name: 'updated_at',
                type_name: 'Number',
                display_text: 'Updated At',
                show_in_form: false,
                show_in_list: false
            },
            {
                name: 'deleted_at',
                type_name: 'Number',
                display_text: 'Deleted At',
                show_in_form: false,
                show_in_list: false
            },
            {
                name: 'created_user_id',
                type_name: 'ShortText',
                display_text: 'Created User ID',
                show_in_form: false,
                show_in_list: false
            },
            {
                name: 'updated_user_id',
                type_name: 'ShortText',
                display_text: 'Updated User ID',
                show_in_form: false,
                show_in_list: false
            },
            {
                name: 'deleted_user_id',
                type_name: 'ShortText',
                display_text: 'Deleted User ID',
                show_in_form: false,
                show_in_list: false
            },
        ];

        return await m.createType(
            req.body.name,
            req.body.slug,
            req.body.display_text,
            req.body.description,
            req.body.has_fields,
            fields
        );
    })
);

/**
 * @swagger
 * /types/{type_name}/fields:
 *   post:
 *     consumes:
 *       - application/json
 *     description: Create content type
 *     parameters:
 *       - in: path
 *         name: type_name
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
router.post('/types/:type_name/fields',
    validateRequest({
    }),
    handleFunc(async function(req) {
        let m = req.app.model('Type');
        let typeName = req.params['type_name'];
        let s = await m.addField(typeName, req.body);

        // update compiled models
        delete req.app.getDB().models[typeName];
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
        return m.deleteType(req.params.type_id);
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
        let typeId = req.params.type_id;

        let s =  await m.updateType(typeId, req.body);

        // update compiled models
        let type = await  m.getType(typeId);
        delete req.app.getDB().models[type.name];

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
 *         name: type_name
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
router.patch('/types/:type_name/fields/:field_id',
    validateRequest({
        type_name: {
            notEmpty: true,
            errorMessage: 'type_name is required'
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
        let typeName = req.params['type_name'];
        let fieldId = req.params['field_id'];
        let m = req.app.model('Type');
        let s = await m.updateTypeField(typeName, fieldId, req.body);

        delete req.app.getDB().models[typeName];

        return s;
    })
);

module.exports =  router;