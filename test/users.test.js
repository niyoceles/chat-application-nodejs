const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const server = require('../server');
const should = chai.should();
const expect = chai.expect();

chai.use(chaiHttp);
// Users block
describe('Users', () => {
	/*
	 * Test for /GET All registered Users
	 */
	describe.skip('GET /api/users', () => {
		it('it should GET all the users', async () => {
			const user = {
				username: faker.name.firstName(),
				password: faker.finance.iban().substr(0, 15),
			};
			chai.request(server).post('/api/users').send(user);
			chai
				.request(server)
				.get('/api/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
				});
		});
	});

	/**
	 * Create User Account - Test suite
	 */
	describe('POST /api/users', () => {
		it('should create user account ', async () => {
			const user = {
				username: faker.name.firstName(),
				password: faker.finance.iban().substr(0, 15),
			};
			chai
				.request(server)
				.post('/api/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.a.property('user').which.is.an('object');
					res.body.user.should.have.property('username');
					res.body.user.should.have.property('createdAt');
					res.body.user.should.have.property('id');
				});
		});

		it('should respond with 400 if an invalid username provided', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[0-9]/i),
				password: faker.finance.iban().substr(0, 15),
			};
			chai
				.request(server)
				.post('/api/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.a.property('message').which.is.an('string');
					res.body.should.have.a.property('errors').which.is.an('array');
					res.body.errors[0].to.have.property('path');
					res.body.errors[0].to.have.property('message');
				});
		});

		it('should respond with 400 if username is empty', async () => {
			const user = {
				username: '',
				password: faker.finance.iban().substr(0, 15),
			};
			chai
				.request(server)
				.post('/api/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.a.property('message').which.is.an('string');
					res.body.should.have.a.property('errors').which.is.an('array');
					res.body.errors[0].to.have
						.property('path')
						.which.is.equal('username');
					res.body.errors[0].to.have.property('message');
				});
		});

		it('should respond with 400 if password is empty', async () => {
			const user = { username: faker.name.firstName(), password: '' };
			chai
				.request(server)
				.post('/api/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.a.property('message').which.is.an('string');
					res.body.should.have.a.property('errors').which.is.an('array');
					res.body.errors[0].to.have
						.property('path')
						.which.is.equal('password');
					res.body.errors[0].to.have.property('message');
				});
		});

		it('should respond with 203 if user already exists', async () => {
			const user = {
				username: faker.name.firstName(),
				password: faker.finance.iban().substr(0, 15),
			};
			chai
				.request(server)
				.post('/api/users')
				.send(user)
				.end(() => {
					chai
						.request(server)
						.post('/api/users')
						.send(user)
						.end((err, res) => {
							res.should.have.status(203);
							res.body.should.be.a('object');
							res.body.should.have.a.property('message').which.is.a('string');
							res.body.errors[0].should.have
								.property('path')
								.which.is.equal('username');
							process.exit(0);
						});
				});
		});
	});

	/**
	 * Create User Account - Test suite
	 */
	describe.skip('POST /api/users/login', () => {
		it('should respond with 200 once user provided right credentials ', async () => {
			const user = {
				username: faker.name.firstName(),
				password: faker.finance.iban().substr(0, 15),
			};
			chai
				.request(server)
				.post('/api/users')
				.send(user)
				.end((err, res) => {
					chai
						.request(server)
						.post('/api/users/login')
						.send(user)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.a.property('message').which.is.an('string');
							res.body.should.have.a.property('token').which.is.an('string');
							res.body.should.have.a.property('user').which.is.an('object');
							res.body.user.should.have.property('username');
							res.body.user.should.have.property('createdAt');
							res.body.user.should.have.property('id');
						});
				});
		});
	});
});
