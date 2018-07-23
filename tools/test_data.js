function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// amount of sleep +- 15min
const duration = 8 * 60 * 60 - (60 * 60) + getRandomInt(0.5 * 60 * 60);
// samples/s
const freq = 2.5;

const n = parseInt(duration * freq, 10);

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

const schema = {
	startTime: new Date().getTime(),
	samples: n,
	data: store,
};

// postman.setEnvironmentVariable("postBody", JSON.stringify(schema));

console.log(JSON.stringify(schema));
