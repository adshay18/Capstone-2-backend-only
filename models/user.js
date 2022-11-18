'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { NotFoundError, BadRequestError } = require('../expressError');
const { BCRYPT_WORK_FACTOR } = require('../config');
const { updateSql } = require('./helpers');

class User {
	// User authentication
	// Returns {username}
	static async verify(username, password) {
		const res = await db.query(
			`SELECT username, password
            FROM users
            WHERE username = $1`,
			[ username ]
		);

		const user = res.rows[0];

		if (user) {
			const correctPassword = await bcrypt.compare(password, user.password);
			if (correctPassword === true) {
				delete user.password;
				return user;
			} else {
				throw new BadRequestError('Incorrect password.');
			}
		} else {
			throw new NotFoundError('Username not found.');
		}
	}

	// Add new user
	// Returns {username, firstName, lastName, email, age, completedTasks}
	static async register({ username, password, firstName, lastName, email, completedTasks = 0, avatar = null }) {
		const duplicateCheck = await db.query(
			`SELECT username
           FROM users
           WHERE username = $1`,
			[ username ]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Username: ${username} is already in use, please pick a different username.`);
		}

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		const result = await db.query(
			`INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            completed_tasks,
            avatar)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, completed_tasks AS "completedTasks"`,
			[ username, hashedPassword, firstName, lastName, email, completedTasks, avatar ]
		);

		const user = result.rows[0];

		return user;
	}

	// Get a user
	// returns {username, firstName, lastName, email, age, completedTasks, avatar}

	static async get(username) {
		const userRes = await db.query(
			`SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
				  completed_tasks AS "completedTasks",
				  avatar
           FROM users
           WHERE username = $1`,
			[ username ]
		);

		const user = userRes.rows[0];
		if (!user) throw new NotFoundError(`No user: ${username}`);
		return user;
	}

	// Get's list of users in order for leaderboard
	// returns [{user1}, {user2}, {user3}...]

	static async getLeaderboard() {
		const rankingRes = await db.query(
			`SELECT username, completed_tasks AS "completedTasks", avatar
			FROM users
			ORDER BY completed_tasks DESC`
		);

		return rankingRes.rows;
	}

	// Update user with data
	// Does not need to be a complete update
	// Data can include {firstName, lastName, password, email, age, avatar, completedTasks}
	// returns {username, firstName, lastName, email, age, avatar, completedTasks}
	// must be verified to run this function as passwords can be changed

	static async update(username, data) {
		if (data.password) {
			data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
		}

		const { setCols, values } = updateSql(data, {
			firstName: 'first_name',
			lastName: 'last_name',
			completedTasks: 'completed_tasks'
		});
		const usernameIdx = '$' + (values.length + 1);

		const query = `	UPDATE users
						SET ${setCols}
						WHERE username = ${usernameIdx}
						RETURNING username, first_name AS "firstName", last_name AS "last_name", email avatar, completed_tasks AS "completedTasks"`;

		const result = await db.query(query, [ ...values, username ]);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user found named ${username}`);

		delete user.password;
		return user;
	}

	// Remove a user from db
	// Returns {deleted: username}
	static async remove(username) {
		let result = await db.query(
			`DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
			[ username ]
		);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user found named ${username}`);

		return { deleted: username };
	}
}

module.exports = User;
