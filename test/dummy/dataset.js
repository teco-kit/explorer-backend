const dummy = {
	dummy1: {
		userId: '',
		start: 1561118400,
		end: 1561204800,
		events: [
			{
				name: 'Water',
				type: '',
				value: 0.5,
				time: 1561118500,
				unit: 'l',
				icon: ''
			},
			{
				name: 'Water',
				type: '',
				value: 1.5,
				time: 1561118800,
				unit: 'l',
				icon: ''
			}
		],
		isPublished: true,
		timeSeries: [
			{
				name: 'VOC',
				unit: 'kOhm',
				data: [
					{
						timestamp: 1561118400,
						value: 10
					},
					{
						timestamp: 1561128400,
						value: 11
					},
					{
						timestamp: 1561138400,
						value: 12
					},
					{
						timestamp: 1561148400,
						value: 13
					},
					{
						timestamp: 1561158400,
						value: 14
					}
				],
				offset: 0
			},
			{
				name: 'SPO2',
				unit: '%',
				data: [
					{
						timestamp: 1561118400,
						value: 10
					},
					{
						timestamp: 1561118500,
						value: 20
					},
					{
						timestamp: 1561118600,
						value: 30
					},
					{
						timestamp: 1561118700,
						value: 40
					},
					{
						timestamp: 1561118800,
						value: 50
					}
				],
				offset: 10
			}
		],
		fusedSeries: {},
		labelings: [
			{
				labelingId: '',
				labels: [
					{
						name: 'Label1',
						type: '',
						start: 1561118700,
						end: 1561119700
					},
					{
						name: 'Label2',
						type: '',
						start: 1561118700,
						end: 1561118900
					},
					{
						name: 'Label3',
						type: '',
						start: 1561118900,
						end: 1561120700
					}
				],
				creator: ''
			},
			{
				labelingId: '',
				labels: [
					{
						name: 'Label4',
						type: '',
						start: 1561118900,
						end: 1561128900
					},
					{
						name: 'Label5',
						type: '',
						start: 1561118900,
						end: 1561138900
					}
				],
				creator: ''
			}
		],
		video: {
			url: 'www.aura.de/video3',
			offset: -5.0
		},
		device: {
			deviceId: 2459128261,
			firmware: '',
			sensors: [],
			generation: 1.0,
			user: ''
		},
		results: []
	},
	dummy2: {
		isPublished: true,
		userId: '',
		start: 1561766400,
		end: 1561896000,
		events: [
			{
				icon: null,
				name: 'Beer',
				type: '',
				value: 0.5,
				time: 1561766700,
				unit: 'l'
			},
			{
				icon: null,
				name: 'Water',
				type: '',
				value: 1.5,
				time: 1561766900,
				unit: 'l'
			}
		],
		timeSeries: [
			{
				offset: 0,
				data: [
					{
						timestamp: 1561766400,
						value: 161
					},
					{
						timestamp: 1561766500,
						value: 202
					},
					{
						timestamp: 1561766600,
						value: 171
					},
					{
						timestamp: 1561766700,
						value: 196
					},
					{
						timestamp: 1561766800,
						value: 214
					}
				],
				name: 'VOC',
				unit: 'kOhm'
			},
			{
				offset: 10,
				data: [
					{
						timestamp: 1561766400,
						value: 40
					},
					{
						timestamp: 1561776400,
						value: 45
					},
					{
						timestamp: 1561786400,
						value: 49
					},
					{
						timestamp: 1561796400,
						value: 43
					},
					{
						timestamp: 1561806400,
						value: 41
					}
				],
				name: 'SPO2',
				unit: '%'
			}
		],
		fusedSeries: [
			{
				timeSeries: [],
			}
		],
		labelings: [
			{
				labels: [
					{
						name: 'Label1',
						type: '',
						start: 1561766400,
						end: 1561766900
					},
					{
						name: 'Label2',
						type: '',
						start: 1561766400,
						end: 1561767400
					},
					{
						name: 'Label3',
						type: '',
						start: 1561766400,
						end: 1561786400
					}
				],
				labelingId: '',
				creator: ''
			},
			{
				labels: [
					{
						name: 'Label4',
						start: 1561766400,
						end: 1561766410
					},
					{
						name: 'Label5',
						type: '',
						start: 1561766400,
						end: 1561766480
					}
				],
				labelingId: '',
				creator: ''
			}
		],
		video: {
			url: 'www.aura.de/video2',
			offset: 1,
		},
		device: '',
		results: [
			{
				name: 'Regressor3',
				value: 80,
				text: 'Regressor3 is predicting some value according to the data in dataset'
			}
		]
	},
	dummy3: {
		isPublished: true,
		userId: '',
		start: 1561786400,
		end: 1561898000,
		events: [],
		timeSeries: [],
		fusedSeries: [],
		labelings: [],
		video: {},
		device: '',
		results: []
	},
	invalidDummy: {
		isPublished: true,
		userId: '',
		events: [],
		timeSeries: [],
		fusedSeries: [],
		labelings: [],
		video: {},
		device: '',
		results: []
	},
};

module.exports = dummy;
