import express from 'express';
import swaggerUi from 'swagger-ui-express';

let router = express.Router();

let options = {
	swaggerUrl: '/_swagger_spec.json'
};

router.get(
	'/_swagger',
	swaggerUi.setup(null, options),
	(req,res, next) => {
		next();
	}
);

router.get('/_swagger_spec.json',  function (req, res) {

    (async function () {

        try {
	          let m = req.app.model('@content/ContentType');
            let results = await m.getContentTypes();

            let swaggerSpec = {
                'swagger': '2.0',
                'info': {
                    'title': '',
                    'description': '',
                    'version': '1.0'
                },
                'produces': ['application/json'],
                'host': '',
                'basePath': '/',
            };

            let paths = {};
            results.map((r) => {

                let parameters = r.fields.map(f => {
                    return {
                        in: 'body',
                        name: f.name,
                        type: getSwaggerDataType(f.type_id),
                        description: f.label
                    };
                });

                paths[`/${r.slug}`] = {
                    'get': {
                        'tags': [`/${r.slug}`],
                        'description': '',
                        'parameters': [],
                        'responses': {}
                    },
                    'post': {
                        'tags': [`/${r.slug}`],
                        'description': '',
                        'parameters': parameters,
                        'responses': {}
                    }
                };

                paths[`/${r.slug}/{${r.slug}_id}`] = {
                    'patch': {
                        'tags': [`/${r.slug}`],
                        'description': '',
                        'parameters': parameters,
                        'responses': {}
                    },
                    'delete': {
                        'tags': [`/${r.slug}`],
                        'description': '',
                        'parameters': [],
                        'responses': {}
                    }
                };
            });

            swaggerSpec.paths = paths;

            res.send(swaggerSpec);
        } catch (e ) {
            res.status(500);
            res.send(e.message);
        }

    })();
});

// TODO handle typeId relation
const getSwaggerDataType = function getSwaggerDataType(typeId) {
    switch (parseInt(typeId)) {
    case 1:
    case 2:
    case 3:
        return 'string';
        break;
    case 6:
        return 'number';
        break;
    }
};

export default router;