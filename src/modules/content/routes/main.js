import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import fieldsToSchema from '../../../fieldsToSchema';

let router = express.Router();

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
	function (req, res, next) {

		let m = req.app.model('@content/ContentType');
		m.getContentType(req.params.slug)
			.then(contentType => {
				if(!contentType) {
					return res.status('404').send('Not Found');
				}

				req.contentType = contentType;

				next();
			});
	},
	function (req, res) {

		(async function () {

			try {

				let fieldsObj = {};

				// TODO change type id integer to type code
				req.contentType.fields.forEach(f => {
					//TODO add feature such as validation
					fieldsObj[f.name] = {
						type: f.type_id
					};
				});

				let schemaObj = fieldsToSchema.convert(fieldsObj);

				let Model;

				try {
					Model = req.app.get('db').model(req.contentType.slug);
				} catch (error) {
					Model = req.app.get('db').model(req.contentType.slug, schemaObj);
				}

				Model.create(req.body, function (err, item) {
					if (err) return handleError(err);
					res.send({
						message: "created",
						item
					})
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
    function (req, res, next) {

        let m = req.app.model('@content/ContentType');
        m.getContentType(req.params.slug)
            .then(contentType => {
                if(!contentType) {
                    return res.status('404').send('Not Found');
                }

                req.contentType = contentType;

                next();
            });
    },
    function (req, res) {

        (async function () {

            try {
	              let m = req.app.model('@content/Content');
                let results = await m.getContents(req.contentType._id);

                let contents = results.map(async (r) => {
                    return await formatField(r.fields, m);
                });

                contents = await Promise.all(contents);

                res.send(contents);
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