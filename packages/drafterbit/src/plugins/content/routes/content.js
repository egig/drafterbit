const validateRequest = require('@drafterbit/common/middlewares/validateRequest');
const FilterQuery = require( '@drafterbit/common/FilterQuery');
const contentMiddleware = require('../middlewares/content');
const Router = require('@koa/router');

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
    async function(ctx, next) {
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
    async function(ctx, next) {
        let typeName = ctx.params['type_name'];
        let  Model = ctx.app.model(typeName);
        let selectFields = ['-__v'];
        ctx.app.plugins().map(m => {
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
    async function(ctx, next) {
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
    async function(ctx, next) {
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
    async function(ctx, next) {

        let page = ctx.query.page || 1;
        let sortBy = ctx.query.sort_by;
        let sortDir = ctx.query.sort_dir || 'asc';
        const PER_PAGE = 10;
        let offset = (page*PER_PAGE) - PER_PAGE;
        let max = PER_PAGE;

        let filterObj = FilterQuery.fromString(ctx.query.fq).toMap();
        let typeName = ctx.params['type_name'];
        let m = ctx.app.model(ctx.params['type_name']);

        let selectFields = ['-__v'];
        ctx.app.plugins().map(m => {
            if (m.selectFields) {
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

        ctx.state.lookupFields.forEach(f => {
            query.populate({
                path: f.name,
                select: '-__v',
                options: { limit: 5 }
            });
        });

        let results = await query.exec();

        // TODO add filter here, e.g to decode password field
        let dataCount = await m.find(matchRule).estimatedDocumentCount();
        ctx.set('Content-Range',`resources ${offset}-${offset+PER_PAGE - (PER_PAGE-dataCount)}/${dataCount}`);
        ctx.body = results;
    }
);

module.exports = router.routes();