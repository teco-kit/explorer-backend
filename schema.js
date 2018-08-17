module.exports = {
	'POST /dataset/submit': {
		type: 'object',
		properties: {
			startTime: {
				type: 'number',
				description: 'Starting Time'
			},
			samples: {
				type: 'integer',
				description: 'Sample Count'
			},
			data: {
				type: 'object',
				delta: {
					type: 'string',
					description: 'Delta Buffer'
				},
				value: {
					type: 'string',
					description: 'Value Buffer'
				},
				description: 'Data Array'
			}
		},
		description: 'Main Object',
		required: [
			'startTime',
			'samples',
			'data'
		]
	}
};
