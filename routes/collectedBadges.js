'use strict';

/** Routes for badges. */

const express = require('express');
const Task = require('../models/task');
const User = require('../models/user');
const CollectedBadge = require('../models/collectedBadge');
const { ensureCorrectUser } = require('../middleware/auth');

const router = express.Router();

/** POST /collectedBadges/username/badgeId:   username, badgeId => {newBadge: {id, badgeId, username}}
 *
 * params must include username and appropriate badgeId from badges db
 *
 * Authorization required: same-user-as-:username
 */

router.post('/:username/:badgeId', ensureCorrectUser, async function(req, res, next) {
	try {
		const newBadge = await CollectedBadge.add(req.params.username, +req.params.badgeId);
		return res.status(201).json({ newBadge });
	} catch (err) {
		return next(err);
	}
});

/** GET /collectedBadges/username => { collectedBadges: [badge1, badge2, badge3...] }
 *
 * Returns { badges: [badge1, ...]}
 *
 * Authorization required: none
 **/

router.get('/:username', async function(req, res, next) {
	try {
		const badgeList = await CollectedBadge.getAllForUser(req.params.username);
		return res.json({ badges: badgeList });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
