'use strict';

const request = require('supertest');

const db = require('../db.js');
const app = require('../app');
const User = require('../models/user');

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	u2Token,
	u3Token
} = require('./_testConfig');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************** POST /users/register */

describe('POST /users/register', function() {
	test('creates new user', async function() {
		const res = await request(app).post('/users/register').send({
			username: 'T1',
			firstName: 'Test',
			lastName: 'User',
			password: 'tp12345',
			email: 'test@gmail.com'
		});
		expect(res.statusCode).toEqual(201);
	});
	test('bad request missing data', async function() {
		const res = await request(app).post('/users/register').send({
			firstName: 'Bad',
			lastName: 'Data'
		});
		expect(res.statusCode).toEqual(400);
	});
});

/************** POST /users/token */

describe('POST /users/token', function() {
	test('creates new token', async function() {
		const res = await request(app).post('/users/token').send({
			username: 'u1',
			password: 'password1'
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.token).toEqual(expect.any(String));
	});

	test('needs correct password', async function() {
		const res = await request(app).post('/users/token').send({
			username: 'u1',
			password: 'misinput'
		});
		expect(res.statusCode).toEqual(400);
	});

	test('404 user not found error', async function() {
		const res = await request(app).post('/users/token').send({
			username: 'notarealuser',
			password: 'wrong'
		});
		expect(res.statusCode).toEqual(404);
	});
});

/************** GET /users/username */

describe('GET /users/:username', function() {
	test('finds user', async function() {
		const res = await request(app).get('/users/u1');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({
			user: {
				username: 'u1',
				firstName: 'U1F',
				lastName: 'U1L',
				email: 'user1@user.com',
				completedTasks: 0,
				avatar: null
			}
		});
	});

	test('404 user not found', async function() {
		const res = await request(app).get('/users/notausername');
		expect(res.statusCode).toEqual(404);
	});
});

/************** PATCH /users/username */

describe('PATCH /users/:username', function() {
	test('works', async function() {
		const res = await request(app)
			.patch('/users/u2')
			.send({ completedTasks: 1 })
			.set('authorization', `Bearer ${u2Token}`);
		expect(res.statusCode).toEqual(200);
	});

	test('fails for incorrect user', async function() {
		const res = await request(app).patch('/users/u2').send({ firstName: "Jeff" }).set('authorization', `Bearer ${u3Token}`);
		expect(res.statusCode).toEqual(400);
	});
});

/************** DELETE /users/username */

describe('DELETE /users/:username', function() {
	test('works', async function() {
		const res = await request(app).delete('/users/u2').set('authorization', `Bearer ${u2Token}`);
		expect(res.statusCode).toEqual(200);
	});

	test('fails for incorrect user', async function() {
		const res = await request(app).delete('/users/u2').set('authorization', `Bearer ${u3Token}`);
		expect(res.statusCode).toEqual(400);
	});
});
