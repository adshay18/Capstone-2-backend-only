'use strict';

/** Shared config for application; can be required many places. */

require('dotenv').config();
require('colors');

const SECRET_KEY = process.env.SECRET_KEY || 'not-bored';

// get port from deployment, or run locally on 3001 as the frontend will run on 3000 locally
const PORT = +process.env.PORT || 3001;

// get database for app
function getDatabaseUri() {
	return process.env.NODE_ENV === 'test' ? 'bored_test' : process.env.DATABASE_URL || 'bored';
}

// app will have work factor of 12, testing will have a factor of 1 for speed
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;

console.log('Config:'.green);
console.log('SECRET_KEY:'.yellow, SECRET_KEY);
console.log('PORT:'.yellow, PORT.toString());
console.log('BCRYPT_WORK_FACTOR'.yellow, BCRYPT_WORK_FACTOR);
console.log('Database:'.yellow, getDatabaseUri());
console.log('---');

module.exports = {
	SECRET_KEY,
	PORT,
	BCRYPT_WORK_FACTOR,
	getDatabaseUri
};
