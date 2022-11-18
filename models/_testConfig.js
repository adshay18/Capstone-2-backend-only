const bcrypt = require('bcrypt');
const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');

// sample task descriptions
const keys = {
	relaxation: 3699502,
	recreational: 8503795,
	cooking: 8061754
};

async function beforeAllTests() {
	// Empty test database
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM tasks');
	await db.query('DELETE FROM collected_badges');
	// Fill with user data
	await db.query(
		`
        INSERT INTO users(username, password, first_name, last_name, email, completed_tasks)
        VALUES  ('Test1', $1, 'test', 'one', 'test.1@gmail.com', 10),
                ('Test2', $2, 'test', 'two', 'test.2@gmail.com', 1),
                ('Test3', $3, 'test', 'three', 'test.3@gmail.com', 504)`,
		[
			await bcrypt.hash('testpass1', BCRYPT_WORK_FACTOR),
			await bcrypt.hash('testpass2', BCRYPT_WORK_FACTOR),
			await bcrypt.hash('testpass3', BCRYPT_WORK_FACTOR)
		]
	);
	// Add tasks for users
	await db.query(
		`
	    INSERT INTO tasks(username, task_id)
	    VALUES  ('Test1', $1),
	            ('Test1', $2),
	            ('Test2', $3),
	            ('Test2', $4),
	            ('Test2', $5),
	            ('Test3', $6)
	            `,
		[ keys.relaxation, keys.recreational, keys.relaxation, keys.recreational, keys.cooking, keys.cooking ]
	);

	// Give users badges for number of complete tasks
	await db.query(
		`INSERT INTO collected_badges (badge_id, username)
         VALUES (1, 'Test1'),
                (2, 'Test1'),
                (3, 'Test1'),
                (1, 'Test2'),
                (1, 'Test3'),
                (2, 'Test3'),
                (3, 'Test3'),
                (4, 'Test3'),
                (5, 'Test3'),
                (6, 'Test3'),
                (7, 'Test3'),
                (8, 'Test3'),
                (9, 'Test3')`
	);
}

async function beforeEachTest() {
	await db.query('BEGIN');
}

async function afterEachTest() {
	await db.query('ROLLBACK');
}

async function afterAllTests() {
	await db.end();
}

module.exports = {
	beforeAllTests,
	beforeEachTest,
	afterEachTest,
	afterAllTests
};
