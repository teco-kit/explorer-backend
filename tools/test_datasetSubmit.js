const prettyBytes = require('pretty-bytes');
const request = require('request');

//const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqQkJRVFV4UmpBM05qVkRORFEzT0RVMVFqUkdOVE0xTXpJNVJrWkdSa1V4UmpRMU0wSTRNdyJ9.eyJuaWNrbmFtZSI6InRlc3QiLCJuYW1lIjoidGVzdEBpbmcuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzc4Y2IwODRmOGVhMDZlM2Y2OTFhZjA5YWU4NzAwY2FmP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGdGUucG5nIiwidXBkYXRlZF9hdCI6IjIwMTgtMDgtMTlUMjI6MTc6MDEuODQ1WiIsImVtYWlsIjoidGVzdEBpbmcuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2F1cmEtc2xlZXAtYW5hbHlzaXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDViNzcyMDFiNmZlOTY0NGFiMTQzNzdlZiIsImF1ZCI6IjR1RTFEd0s1QnRueUluTjE0TE8wTGI0Mk5YdHI1TUhDIiwiaWF0IjoxNTM0NzE3MDIxLCJleHAiOjE1MzQ3NTMwMjF9.K5GJceHwqbbNcylstqL4lDJYtVKtX5l7DCvYkLHiuu1wImmUY6A6D6jXtxd8cwIhqrrhIo9Wp-zTPsu0WWxj5Gl43cntEKT74Mj3EorfPFqwkN1FA2P70d8xJCER-bfG9YKTP1u4TZlkpdh5uF5WORsVXGsAt_acqfvabJkC4lx1HCPFlC9Xki-cZOOPdl3TvAiIxTsiRJrBT4JS1JMe1YjccOWtLZh6BeqgjpwxZUjT3ZxyaFyq76qsfv0t0mL9nTX7VnxWkP8sqjLI1TDngnKVdeqagPbPhbrcAlHMrf9JdsM5rblyN--ydUeBPm7wl3q2Q4n9mzl6TTN8am2Sjg';
const token = 
'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqQkJRVFV4UmpBM05qVkRORFEzT0RVMVFqUkdOVE0xTXpJNVJrWkdSa1V4UmpRMU0wSTRNdyJ9.eyJuaWNrbmFtZSI6InRlc3QiLCJuYW1lIjoidGVzdEBpbmcuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzc4Y2IwODRmOGVhMDZlM2Y2OTFhZjA5YWU4NzAwY2FmP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGdGUucG5nIiwidXBkYXRlZF9hdCI6IjIwMTgtMDktMDdUMTY6MTY6NTguNjgxWiIsImVtYWlsIjoidGVzdEBpbmcuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2F1cmEtc2xlZXAtYW5hbHlzaXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDViNzcyMDFiNmZlOTY0NGFiMTQzNzdlZiIsImF1ZCI6IjR1RTFEd0s1QnRueUluTjE0TE8wTGI0Mk5YdHI1TUhDIiwiaWF0IjoxNTM2MzM3MDE4LCJleHAiOjE1MzYzNzMwMTh9.XemgEePHRvmwErYiU-o9blj8MhORAYR7ftXQRqYZk8CaQnkEebl_YMXCH5ioD2uoSaoqVP8niAL0j_kMjRJQeHTkf4ySzwWMYwN028OkdS510U7J9QLoA1aZpl7w7byohwwyP5sAM-zP5f5-PybNnFVQUdLVqXhjH9UoxuFuKvfTLIhaB_2B4v8Aq2hp-kNMW9GVH2jrljjYmFmUh8UQnQDK1DgbCldaKnGRHj4oydPcYwZtqyoSGWhsAPFaF99ga-dsiWNJx1OwO3y7ppAbxD7AWmX8hE25r-mGpF3Aqq3yZXn4446JrdKxapsKGDMllohz7rXLrLdboQuc56fptg';
const Model = require('../protocol');

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// amount of sleep +- 15min
const duration = 8 * 60 * 60 - (60 * 60) + getRandomInt(0.5 * 60 * 60);
// samples/s
const freq = 1 / 0.144;

const n = parseInt(duration * freq, 10);

//const n = 1337;

const store = new Array(n);

// schema:
// delta [delta time in mS]
// val [value as Float]

for(let i = 0; i < n; i++){
	store[i] = [
		1000 / freq - 50 + getRandomInt(100),
		parseInt(250 - 150 + getRandomInt(300), 10),
	];
}

const object = {
	dataset: {
		startTime: new Date().getTime(),
		sensorData: [
			{
				SensorType: 'VOC',
				SensorId: 0,
				numSamples: n,
				samples: []
			},
		],
	}
};

for(let i = 0; i < n; i++){
	object.dataset.sensorData[0].samples.push({
		voc: {
			value: store[i][1],
			voc: store[i][1],
		},
		delta: store[i][0],
	});
}

const buffer = Model.DatasetRequest.encode(object).finish();

const options = {
	method: 'POST',
	url: 'https://edge.aura.rest/dataset',
	headers: {
		'Postman-Token': '6c2bd464-cc40-4ad4-9e2a-3fbb3b486e22',
		// 'Cache-Control': 'no-cache',
		'Content-Type': 'application/x-protobuf',
		Authorization: `Bearer ${token}`,
	},
	body: buffer,
};

request(options, (error, response, body) => {
	if (error) throw new Error(error);
	const message = Model.DatasetResponse.decode(Buffer.from(body));
	console.log(message);
});

console.log(`${n} Samples; length in byte: ${prettyBytes(buffer.byteLength)}`);
