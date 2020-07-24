import App from "../../../index";
import { middlewares } from '@drafterbit/common';
const contentMiddleware = require('../middlewares/content');
const Router = require('@koa/router');

const { list, validateRequest } = middlewares;
let router = new Router();

router.param('type_name',  contentMiddleware());

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
            presence: true
        },
        id: {
            presence: true
        },
    }),
    async function(ctx: App.Context, next: App.Next) {
        let  Model = ctx.app.model(ctx.params['type_name']);
        ctx.body = await Model.findOneAndDelete({_id: ctx.params.id });
    }
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
            presence: true
        },
        id: {
            presence: true
        },
    }),
    async function(ctx: App.Context, next: App.Next) {
        let typeName = ctx.params['type_name'];
        let  Model = ctx.app.model(typeName);
        let selectFields = ['-__v'];
        ctx.app.plugins().map((m: any) => {
            if (m.selectFields) {
                selectFields = m.selectFields[typeName];
            }
        });
        ctx.body = await Model.findOne({_id: ctx.params.id }).select(selectFields).exec();
    }
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
            presence: true
        },
        id: {
            presence: true
        },
    }),
    async function(ctx: App.Context, next: App.Next) {
        let  Model = ctx.app.model(ctx.params.type_name);
        ctx.body = await Model.findOneAndUpdate({_id: ctx.params.id }, ctx.request.body);
    }
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
            presence: true
        }
    }),
    async function(ctx: App.Context, next: App.Next) {
        let  Model = ctx.app.model(ctx.params.type_name);
        // TODO add filter here, e.g to hash password fiel
        let item = new Model(ctx.request.body);
        await item.save();
        ctx.body = {
            message: 'created',
            item
        };
    }
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
            presence: true
        }
    }),
    async function(ctx: App.Context, next: App.Next) {

        let typeName = ctx.params['type_name'];

        let listHandler = list(typeName, (query: any) => {
            ctx.state.lookupFields.forEach((f: any) => {
                query.populate({
                    path: f.name,
                    select: '-__v',
                    options: { limit: 5 }
                });
            });
            return query;
        });

        await listHandler(ctx, next);
    }
);

module.exports = router.routes();