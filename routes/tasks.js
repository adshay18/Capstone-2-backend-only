'use strict';

/** Routes for tasks. */

const express = require('express');
const Task = require('../models/task');
const User = require('../models/user');
const { ensureCorrectUser } = require('../middleware/auth');

const router = express.Router();

/** POST /tasks/username/key:   username, key => { newTask }
 *
 * params must include username and API key (key is used on the Bored API to indicate a task ID, not an actual API key that a developer must register for)
 *
 * This returns the newly created task:
 *  {newTask: { username, taskID, completed }
 *
 * Authorization required: same-user-as-:username
 */

router.post('/:username/:key', ensureCorrectUser, async function(req, res, next) {
	try {
		const newTask = await Task.add(req.params.username, +req.params.key);
		return res.status(201).json({ newTask });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /tasks/username/key:   username, key => { task }
 *
 * params must include username and API key (key is used on the Bored API to indicate a task ID, not an actual API key that a developer must register for)
 *
 * This returns the newly created task:
 *  {task: { username, taskId, completed }, updatedUser: {username, firstName, lastName, email, age, avatar, completedTasks}} 
 *
 * Authorization required: same-user-as-:username
 */

router.patch('/:username/:key', ensureCorrectUser, async function(req, res, next) {
	try {
		const task = await Task.markComplete(req.params.username, +req.params.key);
		const user = await User.get(req.params.username);
		const completed = user.completedTasks;
		const updatedUser = await User.update(req.params.username, { completedTasks: completed + 1 });
		return res.status(200).json({ task, updatedUser });
	} catch (err) {
		return next(err);
	}
});

/** GET /username => { tasks: [task1, task2, task3...] }
 *
 * Returns { tasks: [task1, ...]}
 *
 * Authorization required: none
 **/

router.get('/:username', async function(req, res, next) {
	try {
		const taskList = await Task.getAllForUser(req.params.username);
		return res.json({ tasks: taskList });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /username/key  =>  { deleted: key from username }
 *
 * Authorization required: same-user-as-:username
 **/

router.delete('/:username/:key', ensureCorrectUser, async function(req, res, next) {
	try {
		await Task.remove(req.params.username, +req.params.key);
		return res.json({ deleted: `${req.params.key} from ${req.params.username}` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
