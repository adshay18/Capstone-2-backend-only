'use strict';

/** Route for leaderboard. */

const jsonschema = require('jsonschema');
const express = require('express');
const User = require('../models/user');


const router = express.Router();

/** GET /leaderboard
 *
 * Returns [{user1, user2, user3...}]
 *
 * Authorization required: none
 **/

 router.get('/', async function(req, res, next) {
	try {
		let leaderboard = await User.getLeaderboard();
		return res.json({leaderboard})
	} catch (err) {
		return next(err)
	}
})

module.exports = router;