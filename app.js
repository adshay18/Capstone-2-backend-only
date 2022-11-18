'use strict';

const express = require('express');
const cors = require('cors');
const { NotFoundError } = require('./expressError');
const { authenticateJWT } = require('./middleware/auth');
const usersRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');
const badgeRoutes = require('./routes/collectedBadges');
const leaderboardRoutes = require('./routes/leaderboard')

// Init app
const app = express();

app.use(cors());
// accepts json
app.use(express.json());
// authenticate users before all routes
app.use(authenticateJWT);
app.use('/users', usersRoutes);
app.use('/tasks', tasksRoutes);
app.use('/collectedBadges', badgeRoutes);
app.use('/leaderboard', leaderboardRoutes)

/** Handle 404 errors -- this matches everything */
app.use(function(req, res, next) {
	return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function(err, req, res, next) {
	if (process.env.NODE_ENV !== 'test') console.error(err.stack);
	const status = err.status || 500;
	const message = err.message;

	return res.status(status).json({
		error: { message, status }
	});
});

module.exports = app;
