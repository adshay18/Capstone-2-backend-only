'use strict';

const { NotFoundError, BadRequestError } = require('../expressError');
const db = require('../db');
const Task = require('./task');
const { beforeAllTests, beforeEachTest, afterEachTest, afterAllTests } = require('./_testConfig');
beforeAll(beforeAllTests);
beforeEach(beforeEachTest);
afterEach(afterEachTest);
afterAll(afterAllTests);

// Get user's tasks

describe('find all tasks a user has saved', function() {
	test('returns array of tasks', async function() {
		const tasks = await Task.getAllForUser('Test1');
		expect(tasks).toEqual([
			{
				taskID: expect.any(Number),
				username: 'Test1',
				completed: false
			},
			{
				taskID: expect.any(Number),
				username: 'Test1',
				completed: false
			}
		]);
	});

	test('returns 404 for invalid username', async function() {
		try {
			await Task.getAllForUser('Wrong_Username');
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.message).toEqual('Username not found');
			expect(e.status).toEqual(404);
		}
	});
});

// Add task

describe('add a new task to db', function() {
	test('works', async function() {
		await Task.add('Test3', 9937387);
		const tasks = await Task.getAllForUser('Test3');
		expect(tasks).toEqual([
			{
				taskID: expect.any(Number),
				username: 'Test3',
				completed: false
			},
			{
				taskID: expect.any(Number),
				username: 'Test3',
				completed: false
			}
		]);
	});

	test('bad request for duplication', async function() {
		try {
			await Task.add('Test3', 3699502);
		} catch (e) {
			expect(e instanceof BadRequestError);
		}
	});

	test('404 for user not found', async function() {
		try {
			await Task.add('Wrong_user', 3699502);
		} catch (e) {
			expect(e instanceof NotFoundError);
		}
	});
});

// Mark complete

describe('mark task as complete', function() {
	test('works', async function() {
		//get id to use
		const tasks = await Task.getAllForUser('Test3');
		const testId = tasks[0].taskID;

		const update = await Task.markComplete('Test3', testId);
		expect(update).toEqual({
			taskID: testId,
			username: 'Test3',
			completed: true
		});

		const updatedTasks = await Task.getAllForUser('Test3');
		expect(updatedTasks).toEqual([
			{
				taskID: testId,
				username: 'Test3',
				completed: true
			}
		]);
	});

	test('404 for id not found', async function() {
		try {
			await Task.markComplete(0);
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.status).toBe(404);
		}
	});
});

// Remove task

describe('removes task from db', function() {
	test('works', async function() {
		const tasks = await Task.getAllForUser('Test3');
		const testId = tasks[0].taskID;
		expect(tasks).toEqual([
			{
				taskID: testId,
				username: 'Test3',
				completed: false
			}
		]);
		const removed = await Task.remove('Test3', testId);
		expect(removed).toEqual({ deleted: 'Task #8061754 from Test3' });

		const updatedTasks = await Task.getAllForUser('Test3');
		expect(updatedTasks).toEqual([]);
	});

	test('404 for taskId not found', async function() {
		try {
			await Task.remove('Test1', 123456);
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.status).toBe(404);
			expect(e.message).toBe('Task not found with ID: 123456');
		}
	});
});
