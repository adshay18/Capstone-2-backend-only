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

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************** POST /collectedBadges/[username]/[badgeId] */

describe('POST /collectedBadges/[username]/[badgeId]', function() {
	test('works', async function() {
		const res = await request(app).post('/collectedBadges/u1/1').set('authorization', `Bearer ${u1Token}`);
		expect(res.statusCode).toEqual(201);
	});

	test('400 incorrect user', async function() {
		const res = await request(app).post('/collectedBadges/u2/1').set('authorization', `Bearer ${u1Token}`);
		expect(res.statusCode).toEqual(400);
	});

	test('404 badge not found', async function() {
		const res = await request(app).post('/collectedBadges/u1/0').set('authorization', `Bearer ${u1Token}`);
		expect(res.statusCode).toEqual(404);
	});

	test('fails on duplication', async function() {
		const res = await request(app).post('/collectedBadges/u1/1').set('authorization', `Bearer ${u1Token}`);
		const res2 = await request(app).post('/collectedBadges/u1/1').set('authorization', `Bearer ${u1Token}`);
		expect(res2.statusCode).toEqual(400);
	});
});

/************** GET /collectedBadges/[username] */

describe('GET /collectedBadges/[username]', function() {
	test('works', async function() {
		const res = await request(app).get('/collectedBadges/u1');
		expect(res.body).toEqual({ badges: [] });
		const res2 = await request(app).get('/collectedBadges/u2');
		expect(res2.body).toEqual({ badges: [ { badgeId: 1, username: 'u2' } ] });
		const res3 = await request(app).get('/collectedBadges/u3');
		expect(res3.body).toEqual({ badges: [ { badgeId: 1, username: 'u3' }, { badgeId: 2, username: 'u3' } ] });
	});

	test('404 user not found', async function() {
		const res = await request(app).get('/collectedBadges/NOTAUSER');
		expect(res.statusCode).toEqual(404);
	});
});
