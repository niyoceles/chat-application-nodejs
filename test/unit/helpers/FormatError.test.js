const chai = require('chai');
const chaiThings = require('chai-things');
const chaiLike = require('chai-like');
const path = require('path');
const { formatError } = require(path.resolve('helpers/FormatError'));
const { expect } = chai;
chai.use(chaiThings);
chai.use(chaiLike);

describe('#FormatApiError(error:object):object', () => {
	it('should return object which contains code:409 for any username which is already registered', async () => {
		const error = {
			code: '23505',
			detail: 'Key (username)=(uhiriwe2) already exists.',
		};
		expect(formatError(error)).to.be.an('object');
		expect(formatError(error)).property('code').to.be.equal(409);
		expect(formatError(error)).property('body').to.be.an('object');
		expect(formatError(error).body).property('message').to.be.a('string');
		expect(formatError(error).body).property('errors').to.be.an('array');
	});

	it('should return object which contains code:400 for any invalid request format', async () => {
		const error = {
			message: 'Invalid request format',
			errors: [{ path: 'username', message: 'username is required' }],
		};
		expect(formatError(error)).to.be.an('object');
		expect(formatError(error)).property('code').to.be.equal(400);
		expect(formatError(error)).property('body').to.be.an('object');
		expect(formatError(error).body).property('message').to.be.a('string');
		expect(formatError(error).body).property('errors').to.be.an('array');
	});

	it('should return object which contains code:401 for not authenticated user', async () => {
		const error = { message: 'not authenticated' };
		expect(formatError(error)).to.be.an('object');
		expect(formatError(error)).property('code').to.be.equal(401);
		expect(formatError(error)).property('body').to.be.an('object');
		expect(formatError(error).body).property('message').to.be.a('string');
	});

	it('should return object which contains code:401 for no sent message to yourself', async () => {
		const error = { message: 'no sent message to yourself' };
		expect(formatError(error)).to.be.an('object');
		expect(formatError(error)).property('code').to.be.equal(401);
		expect(formatError(error)).property('body').to.be.an('object');
		expect(formatError(error).body).property('message').to.be.a('string');
	});

	it('should return object which contains code:401 for password not match', async () => {
		const error = { message: 'password not match' };
		expect(formatError(error)).to.be.an('object');
		expect(formatError(error)).property('code').to.be.equal(401);
		expect(formatError(error)).property('body').to.be.an('object');
		expect(formatError(error).body).property('error').to.be.a('string');
	});

	it('should return object which contains code:404 for user not found', async () => {
		const error = { message: 'user not found' };
		expect(formatError(error)).to.be.an('object');
		expect(formatError(error)).property('code').to.be.equal(404);
		expect(formatError(error)).property('body').to.be.an('object');
		expect(formatError(error).body).property('error').to.be.a('string');
	});

	it('should return object which contains code:404 for receiver not found', async () => {
		const error = { message: 'receiver not found' };
		expect(formatError(error)).to.be.an('object');
		expect(formatError(error)).property('code').to.be.equal(404);
		expect(formatError(error)).property('body').to.be.an('object');
		expect(formatError(error).body).property('error').to.be.a('string');
	});

	it('should return object which contains code:404 for no messages found', async () => {
		const error = { message: 'no messages found' };
		expect(formatError(error)).to.be.an('object');
		expect(formatError(error)).property('code').to.be.equal(404);
		expect(formatError(error)).property('body').to.be.an('object');
		expect(formatError(error).body).property('error').to.be.a('string');
	});

	it('should return object which contains code:500 for any internal server issue', async () => {
		const error = { message: 'Internal server error', errors: [] };
		expect(formatError(error)).to.be.an('object');
		expect(formatError(error)).property('code').to.be.equal(500);
		expect(formatError(error)).property('body').to.be.an('object');
		expect(formatError(error).body).property('message').to.be.a('string');
		expect(formatError(error).body).property('errors').to.be.an('array');
	});
});
