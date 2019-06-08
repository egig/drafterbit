import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import fieldsToSchema from '../../../fieldsToSchema';
import {FIELD_RELATION_TO_MANY, FIELD_RELATION_TO_ONE} from '../../../fieldTypes';

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
							}
						})
				});

				Promise.all(ctPromises)
					.then(rList => {

						rList.map(function (ct) {
							try {
								req.app.get('db').model(ct.name);
							} catch (error) {
								req.app.get('db').model(ct.name, ct.schemaObj);
							}
						})
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
	}
}

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
                console.error(e);
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

            try {
                let m = req.app.get('db').model(req.contentType.slug);
                let results = await m.find();
                res.send(results);
            } catch (e) {
                console.error(e);
                res.status(500);
                res.send(e.message);
            }

        })();
    });


async function formatField(fields, repo) {
    let content = {};
    let rFields = fields.map( async f => {
        content[f.name] = f.value;
        // Get detail if its relation
        // TODO prevent infinite loop here
        if(f.type_id == 4) {
            let a = await repo.getContent(f.value);
            let b = await formatField(a.fields, repo);
            content[f.name] = b;
        }
    });
    await Promise.all(rFields);
    return content;
}

export default router;