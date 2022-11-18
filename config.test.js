'use strict';

describe('config can come from env', function() {
	test('works', function() {
		process.env.SECRET_KEY = 'test';
		process.env.PORT = '5000';
		process.env.DATABASE_URL = 'test_url';
		process.env.NODE_ENV = 'other';

		const config = require('./config');
		expect(config.SECRET_KEY).toEqual('test');
		expect(config.PORT).toEqual(5000);
		expect(config.getDatabaseUri()).toEqual('test_url');
		expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

		delete process.env.SECRET_KEY;
		delete process.env.PORT;
		delete process.env.BCRYPT_WORK_FACTOR;
		delete process.env.DATABASE_URL;

		expect(config.getDatabaseUri()).toEqual('bored');
		process.env.NODE_ENV = 'test';

		expect(config.getDatabaseUri()).toEqual('bored_test');
	});
});
