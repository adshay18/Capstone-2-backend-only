'use strict';

const request = require('supertest');

const db = require('../db.js');
const app = require('../app');

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	u2Token,
	u3Token
} = require('./_testConfig');
const User = require('../models/user.js');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************** POST /tasks/[username]/[key]*/

describe('POST /tasks/[username]/[key]', function() {
	test('create new task', async function() {
		const res = await request(app).post('/tasks/u1/4124860').set('authorization', `Bearer ${u1Token}`);
		expect(res.statusCode).toEqual(201);
	});

	test('fails for incorrect user', async function() {
		const res = await request(app).post('/tasks/u1/4124867').set('authorization', `Bearer ${u2Token}`);
		expect(res.statusCode).toEqual(400);
	});

	test('fails on duplication', async function() {
		const res = await request(app).post('/tasks/u1/4124860').set('authorization', `Bearer ${u1Token}`);
		const res2 = await request(app).post('/tasks/u1/4124860').set('authorization', `Bearer ${u1Token}`);
		expect(res2.statusCode).toEqual(400);
	});
});

/************** PATCH /tasks/[username]/[key] */

describe('PATCH /tasks/[username]/[key]', function() {
	test('works - sets complete and increases user complete count', async function() {
		const user = await User.get('u3');
		expect(user.completedTasks).toEqual(0);

		const res = await request(app).patch('/tasks/u3/3699502').set('authorization', `Bearer ${u3Token}`);
		expect(res.statusCode).toEqual(200);

		const updatedUser = await User.get('u3');
		expect(updatedUser.completedTasks).toEqual(1);
	});

	test('404 task not found', async function() {
		const res = await request(app).patch('/tasks/u3/3699501').set('authorization', `Bearer ${u3Token}`);
		expect(res.statusCode).toEqual(404);
	});

	test('fails for incorrect user', async function() {
		const res = await request(app).patch('/tasks/u3/3699502').set('authorization', `Bearer ${u2Token}`);
		expect(res.statusCode).toEqual(400);
	});
});

/************** GET /tasks/[username] */

describe('GET /tasks/[username]', function() {
	test('works', async function() {
		const res = await request(app).get('/tasks/u2');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({
			tasks: [
				{ username: 'u2', taskID: 8061754, completed: false },
				{ username: 'u2', taskID: 8503795, completed: false }
			]
		});
	});

	test('404 user not found', async function() {
		const res = await request(app).get('/tasks/NOTAUSER');
		expect(res.statusCode).toEqual(404);
	});
});

/************** DELETE /tasks/[username]/[key] */

describe('DELETE /tasks/[username]/[key]', function() {
	test('works', async function() {
		const res = await request(app).delete('/tasks/u1/8503795').set('authorization', `Bearer ${u1Token}`);
		expect(res.statusCode).toEqual(200);
	});

	test('fails for incorrect user', async function() {
		const res = await request(app).delete('/tasks/u1/8503795').set('authorization', `Bearer ${u2Token}`);
		expect(res.statusCode).toEqual(400);
	});

	test('fails on key not found', async function() {
		const res = await request(app).delete('/tasks/u1/4124833').set('authorization', `Bearer ${u1Token}`);
		expect(res.statusCode).toEqual(404);
	});
});
