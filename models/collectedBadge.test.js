'use strict';

const { NotFoundError, BadRequestError } = require('../expressError');
const db = require('../db');
const CollectedBadge = require('./collectedBadge');
const { beforeAllTests, beforeEachTest, afterEachTest, afterAllTests } = require('./_testConfig');
beforeAll(beforeAllTests);
beforeEach(beforeEachTest);
afterEach(afterEachTest);
afterAll(afterAllTests);

//getallbadges
describe('get a list of badges for a user', function() {
	test('works', async function() {
		const badges = await CollectedBadge.getAllForUser('Test3');
		expect(badges).toEqual([
			{
				badgeId: 1,
				username: 'Test3'
			},
			{
				badgeId: 2,
				username: 'Test3'
			},
			{
				badgeId: 3,
				username: 'Test3'
			},
			{
				badgeId: 4,
				username: 'Test3'
			},
			{
				badgeId: 5,
				username: 'Test3'
			},
			{
				badgeId: 6,
				username: 'Test3'
			},
			{
				badgeId: 7,
				username: 'Test3'
			},
			{
				badgeId: 8,
				username: 'Test3'
			},
			{
				badgeId: 9,
				username: 'Test3'
			}
		]);
	});

	test('404 for username not found', async function() {
		try {
			await CollectedBadge.getAllForUser('Wrong_name');
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.status).toBe(404);
		}
	});
});

// add a new badge

describe('add new badge for user', function() {
	test('works', async function() {
		const initBadges = await CollectedBadge.getAllForUser('Test2');
		expect(initBadges).toEqual([ { username: 'Test2', badgeId: 1 } ]);

		//add badge
		await CollectedBadge.add('Test2', 2);
		const updatedBadges = await CollectedBadge.getAllForUser('Test2');
		expect(updatedBadges).toEqual([
			{
				username: 'Test2',
				badgeId: 1
			},
			{
				username: 'Test2',
				badgeId: 2
			}
		]);
	});

	test('404 for invalid username', async function() {
		try {
			await CollectedBadge.add('Wrong', 4);
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.status).toBe(404);
		}
	});
	test('404 for invalid badgeId', async function() {
		try {
			await CollectedBadge.add('Test2', 12);
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.status).toBe(404);
		}
	});
});
