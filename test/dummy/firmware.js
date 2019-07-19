const dummy = {
	dummy1: {
		version: '1.0',
		binary: 'somebufferedstring',
		hash: 'somehash1',
		supportedDevices: [1.0, 2.0, 3.0],
		uploadedAt: '2019-06-29'
	},
	dummy2: {
		version: '2.0',
		binary: 'somebufferedstring',
		hash: 'somehash2',
		supportedDevices: [1.1, 2.1, 3.1],
		uploadedAt: '2019-06-21'
	},
	dummy3: {
		version: '2.4',
		binary: 'somebufferedstring',
		hash: 'somehash3',
		supportedDevices: [1.2, 2.2, 3.2],
		uploadedAt: '2019-06-16'
	},
	invalidDummy: {
		binary: 'somebufferedstring',
		supportedDevices: [1.2, 2.2, 3.2],
		hash: 'somehash4'
	},
};

module.exports = dummy;
