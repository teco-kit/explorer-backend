// swagger definitions
module.exports = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Aura API',
			version: '1.0.0',
			description: "API specification for Aura REST API. See <a target=_blank href='https://drive.google.com/open?id=1r5UP4bS-ar_1ba3VrCOIdHIKzuWLY_TR'>UML</a> for more details."
		},
		host: process.env.NODE_ENV === 'production' ? 'edge.aura.rest' : 'localhost:3000',
		basePath: '/',
	},
	apis: [
		'./docs/schemes/*.yaml',
		'./docs/tags.yaml',
		'./docs/routes/*.yaml',
		'./docs/routes/subroutes/*.yaml'
	]
};
