const express = require('express');
const ApiRepository = require('../repository/ApiRepository');
const ContentTypeRepository = require('../repository/ContentTypeRepository');
const ContentRepository = require('../repository/ContentRepository');
const validateRequest = require('../middlewares/validateRequest');

let router = express.Router();


/**
 * @swagger
 * /{slug}:
 *   get:
 *     description: Get contents
 *     parameters:
 *       - in: path
 *         name: slug
 *         type: strimg
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

        let r = new ContentTypeRepository();
        r.getContentType(req.params.slug)
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
                let repo = new ContentRepository(req.app);
                let results = await repo.getContents(req.contentType.id);

                let contents = results.map(async (r) => {
                    return await formatField(r.fields, repo);
                });

                contents = await Promise.all(contents);

                res.send(contents);
            } catch (e) {
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

module.exports = router;