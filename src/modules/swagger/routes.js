const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

let router = express.Router();

const swaggerSpec = swaggerJSDoc({
	swaggerDefinition: {
		info: {
			title: 'Drafterbit',
			version: 'v3.0'
		},
		produces: ['application/json'],
		host: '',
		basePath: '/',
		securityDefinitions: {
			"api_key": {
				"type": "apiKey",
				"name": "api_key",
				"in": "query"
			}
	  },
		security: [
			{api_key: []}
		]
	},
	apis: [
		path.resolve(__dirname + '/../**/*.js')
	]
});

// TODO use custom css
// const showExplorer = false;
// const options = {};
// const customCss = '';
const customfavIcon = "https://pbs.twimg.com/profile_images/770620527341744128/lHd4FaXz.jpg";

let options = {
	  customfavIcon,
    swaggerUrl: '/_swagger_spec.json',
};

router.get(
    '/',
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

            swaggerSpec.paths = Object.assign({}, paths, swaggerSpec.paths);

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
    case 6:
        return 'number';
    }
};

module.exports = router;