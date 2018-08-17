function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function typedarrayToBuffer (arr) {
	// To avoid a copy, use the typed array's underlying ArrayBuffer to back new Buffer
	let buf = Buffer.from(arr.buffer);
	if (arr.byteLength !== arr.buffer.byteLength) {
		// Respect the "view", i.e. byteOffset and byteLength, without doing a copy
		buf = buf.slice(arr.byteOffset, arr.byteOffset + arr.byteLength);
	}
	return buf;
}

// amount of sleep +- 15min
const duration = 8 * 60 * 60 - (60 * 60) + getRandomInt(0.5 * 60 * 60);
// samples/s
const freq = 2.5;

const n = parseInt(duration * freq, 10);

const adata = {
	adelta: new Uint16Array(n),
	avalue: new Uint32Array(n),
};

// schema:
// delta [delta time in mS]
// val [value as Float]

for(let i = 0; i < n; i++){
	adata.avalue[i] = parseInt(250 - 150 + getRandomInt(300), 10);
	adata.adelta[i] = 1000 / freq - 50 + getRandomInt(100);
}

const schema = {
	startTime: new Date().getTime(),
	samples: n,
	data: {
		delta: typedarrayToBuffer(adata.adelta).toString(),
		value: typedarrayToBuffer(adata.avalue).toString(),
	},
};

postman.setEnvironmentVariable("postBody", JSON.stringify(schema));
//console.log(JSON.stringify(schema));
