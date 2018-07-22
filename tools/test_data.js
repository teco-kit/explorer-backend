// amount of sleep +- 15min
const duration = 8 * 60 * 60 - (60*60) + getRandomInt(0.5*60*60);
// samples/s
const freq = 2.5;

const n = parseInt(duration * freq);

let store = new Array(n);

// schema:
// delta [delta time in mS]
// val [value as Float]

for(let i=0; i<n; i++){
  store[i] = [
    1000/freq - 50 + getRandomInt(100),
    parseFloat(rfloat(5).toFixed(2)),
  ];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function rfloat(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('Expected all arguments to be numbers');
  }

  return Math.random() * (max - min) + min;
}

const schema = {
  startTime: new Date().getTime(),
  samples: n,
  data: store,
}

//postman.setEnvironmentVariable("postBody", JSON.stringify(schema));

console.log(JSON.stringify(schema));
