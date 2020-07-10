const validateRequest = require('@drafterbit/common/middlewares/validateRequest');
const FilterQuery = require('@drafterbit/common/FilterQuery');
const Router = require('@koa/router');

let router = new Router();

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
            presence: true,
        }
    }),
    async (ctx, next) => {
        let m = ctx.app.model('Type');
        ctx.body = await m.getType(ctx.params.type_name);
    }
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
router.get('/types', async (ctx, next) => {
    let m = ctx.app.model('Type');
    let fq = FilterQuery.fromString(ctx.query.fq);
    ctx.body = await m.getTypes(fq.toMap());
});

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
            presence: true,
        },
        slug: {
            presence: true,
        },
        display_text: {
            presence: true,
        },
        description: {
            presence: false,
            type: 'string',
        },
        fields: {
            type: 'array',
        }
    }),
    async function  (ctx, next) {
        let m = ctx.app.model('Type');

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

        let reqBody = ctx.request.body;
        ctx.body = await m.createType(
            reqBody.name,
            reqBody.slug,
            reqBody.display_text,
            reqBody.description,
            reqBody.has_fields,
            fields
        );
    }
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
    async function(ctx, next) {
        let m = ctx.app.model('Type');
        let typeName = ctx.params['type_name'];
        let s = await m.addField(typeName, ctx.request.body);

        // update compiled models
        delete ctx.app.getDB().models[typeName];
        ctx.body = s;
    }
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
            presence: true
        }
    }),
    async function(ctx, next) {
        ctx.body = await m.deleteType(ctx.params.type_id);
    }
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
            presence: true,
        }
    }),
    async function(ctx) {
        let m = ctx.app.model('Type');
        let typeId = ctx.params.type_id;

        let s =  await m.updateType(typeId, ctx.body);

        // update compiled models
        let type = await  m.getType(typeId);
        delete ctx.app.getDB().models[type.name];

        ctx.body = type;
    }
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
            presence: true
        }
    }),
    async function(ctx) {
        let typeName = ctx.params['type_name'];
        let fieldId = ctx.params['field_id'];
        let m = ctx.app.model('Type');
        let s = await m.updateTypeField(typeName, fieldId, ctx.request.body);

        delete ctx.app.getDB().models[typeName];

        ctx.body = s;
    }
);

module.exports =  router.routes();