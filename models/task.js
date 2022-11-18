'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');

class Task {
	// Add a new task associated to a user
	// Returns {taskID, username, completed}

	static async add(username, key) {
		const userCheck = await db.query(
			`SELECT username
           FROM users
           WHERE username = $1`,
			[ username ]
		);
		const user = userCheck.rows[0];

		if (!user) throw new NotFoundError(`No username: ${username}`);

		const duplicateCheck = await db.query(
			`SELECT * FROM tasks
			 WHERE username = $1 AND task_id = $2`,
			[ username, key ]
		);

		const duplicate = duplicateCheck.rows[0];
		if (duplicate) throw new BadRequestError(`${username} already has task.`);

		await db.query(
			`INSERT INTO tasks (username, task_id)
			VALUES ($1, $2)
			RETURNING task_id AS "taskID", username, completed`,
			[ username, key ]
		);
	}

	// Mark a task as completed
	// Returns {taskID, username, completed}
	static async markComplete(username, key) {
		const userCheck = await db.query(`SELECT * FROM users WHERE username = $1`, [ username ]);
		if (!userCheck.rows[0]) throw new NotFoundError('Username not found');

		const result = await db.query(
			`
        UPDATE tasks
        SET completed = true
        WHERE task_id = $1 AND username = $2
        RETURNING task_id AS "taskID", username, completed`,
			[ key, username ]
		);

		const task = result.rows[0];

		if (!task) throw new NotFoundError(`Task not found with ID: ${key}`);
		return task;
	}

	// Get all tasks associated with a user
	// Returning [{taskID, username, completed}...]
	static async getAllForUser(username) {
		const userCheck = await db.query(`SELECT * FROM users WHERE username = $1`, [ username ]);
		if (!userCheck.rows[0]) throw new NotFoundError('Username not found');

		const result = await db.query(
			`
        SELECT task_id AS "taskID", username, completed FROM tasks
        WHERE username = $1
        ORDER BY task_id`,
			[ username ]
		);

		return result.rows;
	}

	// Remove a task from user's list
	// Returns {deleted: Task #key from username}

	static async remove(username, key) {
		const userCheck = await db.query(`SELECT * FROM users WHERE username = $1`, [ username ]);
		if (!userCheck.rows[0]) throw new NotFoundError('Username not found');

		const result = await db.query(
			`
        DELETE FROM tasks
        WHERE task_id = $1 AND username = $2
        RETURNING task_id AS "taskID"`,
			[ key, username ]
		);

		const deletedTask = result.rows[0];
		if (!deletedTask) throw new NotFoundError(`Task not found with ID: ${key}`);
		return { deleted: `Task #${key} from ${username}` };
	}
}

module.exports = Task;
