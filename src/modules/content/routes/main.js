import express from 'express';
import Content from '../model/Content';
import ContentType from '../model/ContentType';
import validateRequest from '../../../middlewares/validateRequest';

let router = express.Router();


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

        let m = ContentType(req.app.get('db'));
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

	console.log("req.contentType.id", req.contentType.id);

        (async function () {

            try {
                let repo = Content(req.app.get('db'));
                let results = await repo.getContents(req.contentType.id);

                let contents = results.map(async (r) => {
                    return await formatField(r.fields, repo);
                });

                contents = await Promise.all(contents);

                res.send(contents);
            } catch (e) {
            	  console.log(e)
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