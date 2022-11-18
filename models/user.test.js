'use strict';

const { ExpressError, NotFoundError, BadRequestError } = require('../expressError');
const db = require('../db');
const User = require('./user');
const { beforeAllTests, beforeEachTest, afterEachTest, afterAllTests } = require('./_testConfig');

beforeAll(beforeAllTests);
beforeEach(beforeEachTest);
afterEach(afterEachTest);
afterAll(afterAllTests);

// Verification of User

describe('verify user', function() {
	test('works', async function() {
		const user = await User.verify('Test1', 'testpass1');
		expect(user).toEqual({ username: 'Test1' });
	});

	test('Not found for no user', async function() {
		try {
			await User.verify('DNE', 'password');
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.message).toEqual('Username not found.');
		}
	});

	test('Bad request for incorrect password', async function() {
		try {
			await User.verify('Test2', 'testpass1');
		} catch (e) {
			expect(e instanceof BadRequestError).toBeTruthy();
			expect(e.message).toEqual('Incorrect password.');
		}
	});
});

// User registration

describe('register new user', function() {
	test('works', async function() {
		const user = await User.register({
			username: 'Test4',
			password: 'testpass4',
			firstName: 'test',
			lastName: 'four',
			email: 'test.4@gmail.com'
		});
		expect(user).toEqual({
			username: 'Test4',
			firstName: 'test',
			lastName: 'four',
			email: 'test.4@gmail.com',
			completedTasks: 0
		});
	});

	test('Bad request for username already in use', async function() {
		try {
			await User.register({
				username: 'Test4',
				password: 'testpass4',
				firstName: 'test',
				lastName: 'four',
				email: 'test.4@gmail.com'
			});
		} catch (e) {
			expect(e instanceof BadRequestError).toBeTruthy();
			expect(e.message).toEqual('Username: Test1 is already in use, please pick a different username.');
		}
	});
});

// Get

describe('find users by username', function() {
	test('works', async function() {
		const user = await User.get('Test3');
		expect(user).toEqual({
			username: 'Test3',
			firstName: 'test',
			lastName: 'three',
			email: 'test.3@gmail.com',
			completedTasks: 504,
			avatar: null
		});
	});

	test('404 if not found', async function() {
		try {
			await User.get('Wrong_Username');
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.status).toEqual(404);
			expect(e.message).toEqual('No user: Wrong_Username');
		}
	});
});

// Update

describe('accepts partial update for a user', function() {
	test('verifies user data has changed in db', async function() {
		const user = await User.get('Test3');
		expect(user).toEqual({
			username: 'Test3',
			firstName: 'test',
			lastName: 'three',
			email: 'test.3@gmail.com',
			completedTasks: 504,
			avatar: null
		});
		await User.update('Test3', { completedTasks: 505, avatar: 'URL' });
		const updatedUser = await User.get('Test3');
		expect(updatedUser).toEqual({
			username: 'Test3',
			firstName: 'test',
			lastName: 'three',
			email: 'test.3@gmail.com',
			completedTasks: 505,
			avatar: 'URL'
		});
	});

	test('404 if not found', async function() {
		try {
			await User.update('Wrong_Username', { completedTasks: 25 });
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.status).toEqual(404);
			expect(e.message).toEqual('No user found named Wrong_Username');
		}
	});
});

// Deletion

describe('deletes user from db', function() {
	test('user no longer exists after deletion', async function() {
		const user = await User.get('Test2');
		expect(user.email).toEqual('test.2@gmail.com');
		await User.remove('Test2');
		try {
			await User.get('Test2');
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.message).toEqual('No user: Test2');
		}
	});

	test('responds with deletion message', async function() {
		const res = await User.remove('Test1');
		expect(res).toEqual({ deleted: 'Test1' });
	});

	test('404 if not found', async function() {
		try {
			await User.remove('Wrong_Username', { completedTasks: 25 });
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
			expect(e.status).toEqual(404);
			expect(e.message).toEqual('No user found named Wrong_Username');
		}
	});
});
