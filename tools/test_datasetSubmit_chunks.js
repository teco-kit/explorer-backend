const prettyBytes = require('pretty-bytes');
const request = require('request-promise-native');

// const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqQkJRVFV4UmpBM05qVkRORFEzT0RVMVFqUkdOVE0xTXpJNVJrWkdSa1V4UmpRMU0wSTRNdyJ9.eyJuaWNrbmFtZSI6InRlc3QiLCJuYW1lIjoidGVzdEBpbmcuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzc4Y2IwODRmOGVhMDZlM2Y2OTFhZjA5YWU4NzAwY2FmP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGdGUucG5nIiwidXBkYXRlZF9hdCI6IjIwMTgtMDgtMTlUMjI6MTc6MDEuODQ1WiIsImVtYWlsIjoidGVzdEBpbmcuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2F1cmEtc2xlZXAtYW5hbHlzaXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDViNzcyMDFiNmZlOTY0NGFiMTQzNzdlZiIsImF1ZCI6IjR1RTFEd0s1QnRueUluTjE0TE8wTGI0Mk5YdHI1TUhDIiwiaWF0IjoxNTM0NzE3MDIxLCJleHAiOjE1MzQ3NTMwMjF9.K5GJceHwqbbNcylstqL4lDJYtVKtX5l7DCvYkLHiuu1wImmUY6A6D6jXtxd8cwIhqrrhIo9Wp-zTPsu0WWxj5Gl43cntEKT74Mj3EorfPFqwkN1FA2P70d8xJCER-bfG9YKTP1u4TZlkpdh5uF5WORsVXGsAt_acqfvabJkC4lx1HCPFlC9Xki-cZOOPdl3TvAiIxTsiRJrBT4JS1JMe1YjccOWtLZh6BeqgjpwxZUjT3ZxyaFyq76qsfv0t0mL9nTX7VnxWkP8sqjLI1TDngnKVdeqagPbPhbrcAlHMrf9JdsM5rblyN--ydUeBPm7wl3q2Q4n9mzl6TTN8am2Sjg';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqQkJRVFV4UmpBM05qVkRORFEzT0RVMVFqUkdOVE0xTXpJNVJrWkdSa1V4UmpRMU0wSTRNdyJ9.eyJuaWNrbmFtZSI6InRlc3QiLCJuYW1lIjoidGVzdEBpbmcuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzc4Y2IwODRmOGVhMDZlM2Y2OTFhZjA5YWU4NzAwY2FmP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGdGUucG5nIiwidXBkYXRlZF9hdCI6IjIwMTgtMTItMDZUMTQ6Mzk6MjYuMTE3WiIsImVtYWlsIjoidGVzdEBpbmcuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2F1cmEtc2xlZXAtYW5hbHlzaXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDViNzcyMDFiNmZlOTY0NGFiMTQzNzdlZiIsImF1ZCI6IjR1RTFEd0s1QnRueUluTjE0TE8wTGI0Mk5YdHI1TUhDIiwiaWF0IjoxNTQ0MTA3MTY2LCJleHAiOjE1NDQxNDMxNjZ9.J5ia99mor9LtllmmeYfXNB5pQpS-qVhak4cWx26tcYNX5RZ8OgeWO8IwF9NRR3POZMyvsVmxyw71EqvoEbtPc4p3Av3npwIrza1a4oEAuAivHEv0SdSDzupsxk03ohHqCdlpSM2ELcifzZti_OFL9GhhNojK7DbJWJ0L_ArLDrJ5nqfYOQuZZinzo-qvIB0xa8AYhbRsmepBclMUJIHppxLTXISfQGR-wAC3v2jb5pF3k_hDSMAa9DTcV3LMqMdu5Uy6lcxx5Y2ENCaR3RePa0kUG64eUbu4ZPFmbkfPVgIr1HGSRvZdlXn_IwuL3cWBdnJTUaLH2jGQarowFtiKFA';

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
	data: buffer.toString('base64'),
};

async function submit(){
	const id = await getID();

	console.log(`got ID: ${id}`);

	const options = {
		method: 'POST',
		url: `https://edge.ng.aura.rest/dataset/${id}`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	};


	request(options).then((res) => {
		console.log(JSON.parse(res));
	});
}

submit();
