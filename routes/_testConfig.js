const db = require('../db.js');
const User = require('../models/user.js');
const Task = require('../models/task');
const CollectedBadge = require('../models/collectedBadge');
const { createToken } = require('./helpers');

const keys = {
	relaxation: 3699502,
	recreational: 8503795,
	cooking: 8061754
};

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM tasks');
	await db.query('DELETE FROM collected_badges');

	await User.register({
		username: 'u1',
		password: 'password1',
		firstName: 'U1F',
		lastName: 'U1L',
		email: 'user1@user.com'
	});
	await User.register({
		username: 'u2',
		password: 'password2',
		firstName: 'U2F',
		lastName: 'U2L',
		email: 'user2@user.com'
	});
	await User.register({
		username: 'u3',
		password: 'password3',
		firstName: 'U3F',
		lastName: 'U3L',
		email: 'user3@user.com'
	});

	await Task.add('u1', keys.cooking);
	await Task.add('u1', keys.recreational);
	await Task.add('u1', keys.relaxation);
	await Task.add('u2', keys.cooking);
	await Task.add('u2', keys.recreational);
	await Task.add('u3', keys.relaxation);

	await CollectedBadge.add('u2', 1);
	await CollectedBadge.add('u3', 1);
	await CollectedBadge.add('u3', 2);
}

async function commonBeforeEach() {
	await db.query('BEGIN');
}

async function commonAfterEach() {
	await db.query('ROLLBACK');
}

async function commonAfterAll() {
	await db.end();
}

const u1Token = createToken({ username: 'u1' });
const u2Token = createToken({ username: 'u2' });
const u3Token = createToken({ username: 'u3' });

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	u2Token,
	u3Token
};
