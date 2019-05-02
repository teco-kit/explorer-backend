const prettyBytes = require('pretty-bytes');
const request = require('request-promise-native');
const FormData = require('form-data');

// const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqQkJRVFV4UmpBM05qVkRORFEzT0RVMVFqUkdOVE0xTXpJNVJrWkdSa1V4UmpRMU0wSTRNdyJ9.eyJuaWNrbmFtZSI6InRlc3QiLCJuYW1lIjoidGVzdEBpbmcuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzc4Y2IwODRmOGVhMDZlM2Y2OTFhZjA5YWU4NzAwY2FmP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGdGUucG5nIiwidXBkYXRlZF9hdCI6IjIwMTgtMDgtMTlUMjI6MTc6MDEuODQ1WiIsImVtYWlsIjoidGVzdEBpbmcuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2F1cmEtc2xlZXAtYW5hbHlzaXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDViNzcyMDFiNmZlOTY0NGFiMTQzNzdlZiIsImF1ZCI6IjR1RTFEd0s1QnRueUluTjE0TE8wTGI0Mk5YdHI1TUhDIiwiaWF0IjoxNTM0NzE3MDIxLCJleHAiOjE1MzQ3NTMwMjF9.K5GJceHwqbbNcylstqL4lDJYtVKtX5l7DCvYkLHiuu1wImmUY6A6D6jXtxd8cwIhqrrhIo9Wp-zTPsu0WWxj5Gl43cntEKT74Mj3EorfPFqwkN1FA2P70d8xJCER-bfG9YKTP1u4TZlkpdh5uF5WORsVXGsAt_acqfvabJkC4lx1HCPFlC9Xki-cZOOPdl3TvAiIxTsiRJrBT4JS1JMe1YjccOWtLZh6BeqgjpwxZUjT3ZxyaFyq76qsfv0t0mL9nTX7VnxWkP8sqjLI1TDngnKVdeqagPbPhbrcAlHMrf9JdsM5rblyN--ydUeBPm7wl3q2Q4n9mzl6TTN8am2Sjg';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqQkJRVFV4UmpBM05qVkRORFEzT0RVMVFqUkdOVE0xTXpJNVJrWkdSa1V4UmpRMU0wSTRNdyJ9.eyJuaWNrbmFtZSI6InRlc3QiLCJuYW1lIjoidGVzdEBpbmcuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzc4Y2IwODRmOGVhMDZlM2Y2OTFhZjA5YWU4NzAwY2FmP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGdGUucG5nIiwidXBkYXRlZF9hdCI6IjIwMTgtMTItMDdUMTQ6MDQ6NDUuODE1WiIsImVtYWlsIjoidGVzdEBpbmcuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2F1cmEtc2xlZXAtYW5hbHlzaXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDViNzcyMDFiNmZlOTY0NGFiMTQzNzdlZiIsImF1ZCI6IjR1RTFEd0s1QnRueUluTjE0TE8wTGI0Mk5YdHI1TUhDIiwiaWF0IjoxNTQ0MTkxNDg1LCJleHAiOjE1NDQyMjc0ODV9.kobCdYDXtqSq1rVuJXlTK7TrSjH-uH-J-6jX_R1M94mqWijXherQL6K_5MuW6CQ6Ehm2yCEB--KujTVxB-b-9MwnUxZl-fAmEHPBC0H9OnRiJZo225uY5xtzipZM_gBfljxh-7FeKdQzFmUR0QjTF-QHbfsFLfGDs7OeBEerDW68nI5V3uhyDkvy87wvj5df7_AZP8t_UoWlJIA0jSd_71GJMHMw6UIjuXoXVVcZU2AKifOhnpxj7-zNnIA6meP-0U2J7QWDc1beDiB6Cr2nECFsRThSTSs866myypMSkWQzKMb5Zx7NEMmCPz7AIXSZuvsR2kqEP_6It8_hSDumMg';

const dataset = require('./dataset.json');

const chunks = [];

const MTU = 20;

const bytesPerSample = 4;

const samplesPerPacket = (MTU - 4) / bytesPerSample;

let sampleCounter = 0;

async function getID(){
	// get dataset ID

	const response = JSON.parse(await request({
		method: 'GET',
		url: 'https://edge.ng.aura.rest/emulator/dataset_id',
		qs: {
			auth: '1337'
		},
	}));

	return response.datasetid;
}

function getSamples(n){
	const ret = dataset.data.slice(sampleCounter, sampleCounter + n);

	sampleCounter += n;

	return ret;
}

const numChunks = dataset.data.length / samplesPerPacket;

for(let i = 0; i < numChunks; i++){
	let chunkid = chunks.length;

	if(process.argv[3] === 'missing'){
		// missing chunks
		if(chunkid > 10){
			chunkid += 1;
		}
		if(chunkid > 20){
			chunkid += 1;
		}
		if(chunkid > 30){
			chunkid += 1;
		}
	}

	const arr = [chunks.length, ...getSamples(samplesPerPacket)];
	const data = Buffer.from(Uint32Array.from(arr).buffer);

	chunks.push(data);
}

const buffer = Buffer.concat(chunks);

const body = {
	startTime: new Date().getTime(),
	interval: 150,
	numChunks: chunks.length,
	MTU: MTU,
	// data: buffer.toString('base64'),
};

async function submit(){
	const id = await getID();

	console.log(`got ID: ${id}`);

	const options = {
		method: 'POST',
		url: `https://edge.ng.aura.rest/dataset/${id}`,
		formData: {
			meta: {
				value: JSON.stringify(body),
				options: {
					filename: 'meta',
					contentType: 'application/json'
				}
			},
			data: {
				value: buffer,
				options: {
					filename: 'data',
					contentType: 'application/octet-stream',
				}
			}
		},
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${token}`,
		},
		// body: JSON.stringify(body),
	};

	request(options).then((res) => {
		console.log(JSON.parse(res));
	});
}

submit();