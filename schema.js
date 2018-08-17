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
				type: 'array',
				items: {
					type: 'array',
					items: [
						{
							type: 'integer'
						},
						{
							type: 'integer'
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
