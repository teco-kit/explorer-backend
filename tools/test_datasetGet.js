const prettyBytes = require('pretty-bytes');
const request = require('request');

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqQkJRVFV4UmpBM05qVkRORFEzT0RVMVFqUkdOVE0xTXpJNVJrWkdSa1V4UmpRMU0wSTRNdyJ9.eyJuaWNrbmFtZSI6InRlc3QiLCJuYW1lIjoidGVzdEBpbmcuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzc4Y2IwODRmOGVhMDZlM2Y2OTFhZjA5YWU4NzAwY2FmP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGdGUucG5nIiwidXBkYXRlZF9hdCI6IjIwMTgtMDgtMzFUMjE6MTU6MDEuOTE4WiIsImVtYWlsIjoidGVzdEBpbmcuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2F1cmEtc2xlZXAtYW5hbHlzaXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDViNzcyMDFiNmZlOTY0NGFiMTQzNzdlZiIsImF1ZCI6IjR1RTFEd0s1QnRueUluTjE0TE8wTGI0Mk5YdHI1TUhDIiwiaWF0IjoxNTM1NzUwMTAxLCJleHAiOjE1MzU3ODYxMDF9.MiN2W1NIZtig49oBd9-ZF4wtYq22z1y9tSwLZcS8DUkaNYPneGLBmXJORL8NWW8mBfkGA1iKw9hoKZNa-3W-NHHAm9Bv5H1eA0mhAGfA8Vw4Pv9riFTlHDYSI78LB-5ltB7r7b-jadqfQLQibWn6LSyZdOllX7U0EZZgc0cbLSegThl8dbSYF69qWaihqY03PatQZeVXOuZaLOk6qz6gTpqayEDVgZfbaEN7gVBBvpVAYO1_BvIaY_mJnlCrzOECs2REtaZAqnSHwJgS1Q7IDMfKBs8j6_7QmSavMDccAKJGOjiMXmjz65TiqqSYwvars-tHi19W8lamllbQUMBJdA';
const datasetId = '5b89df5f0a98e6423ade28d2';
const proto = require('../protocol');

const buffer = proto.DatasetGet.encode({
	id: datasetId,
}).finish();

const options = {
	method: 'GET',
	url: `http://localhost:3000/dataset/get/${datasetId}`,
	headers: {
		Authorization: `Bearer ${token}`,
	},
	encoding: null,
};

request(options, (error, response, body) => {
	if (error) throw new Error(error);
	const message = proto.DatasetGetResponse.decode(body);
	const dataset = proto.SensorDataset_t.decode(message.data);
	console.log(dataset.samples);
});
