// require supertest
const request = require('supertest');

// require the Koa server
const server = require('../server');

// do something before anything else runs
beforeAll(async () => {
	console.log('Jest starting!');
});

// close the server after each test
afterEach(() => {
	server.close();
	console.log('server closed!');
});

// testing basic routing
describe('routing: server', () => {
	test('should respond as expected', async () => {
		const response = await request(server).get('/');
		expect(response.status).toEqual(200);
		expect(response.type).toEqual('application/json');
	});
});
