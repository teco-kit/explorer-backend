module.exports = {
	'POST /analyze': {
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
				type: 'array',
				items: {
					type: 'array',
					items: [
						{
							type: 'integer'
						},
						{
							type: 'number',
							// multipleOf: 0.001
						}
					],
					additionalItems: false,
					description: '[delta, val]'
				},
				description: 'Data Array'
			}
		},
		description: 'data',
		required: [
			'startTime',
			'samples',
			'data'
		]
	}
};
