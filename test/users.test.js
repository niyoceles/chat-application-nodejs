const chai = require('chai');
const chaiThings = require('chai-things');
const chaiLike = require('chai-like');
const faker = require('faker');
const path = require('path');

const server = require(path.resolve('server'));
const request = require('supertest')(server);

const { expect } = chai;
chai.use(chaiThings);
chai.use(chaiLike);

// Users block
describe('#Users', () => {
	/*
	 * Test for /GET All registered Users
	 */
	describe('- GET /api/users', () => {
		it('it should respond with 200 Ok - if there are users registered', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: faker.finance.iban().substr(0, 15),
			};
			const user1 = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: faker.finance.iban().substr(0, 15),
			};
			await request.post('/api/users').send(user);
			await request.post('/api/users').send(user1);
			const userInfo = await request.post('/api/users/login').send(user);
			request
				.get('/api/users')
				.set('authorization', `Bearer ${userInfo.body.token}`)
				.expect(res => {
					expect(res.status).to.be.equal(200);
					expect(res.body).to.be.an('array');
				});
		});

		it('it should respond with 401 if user is not authenticated', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: faker.finance.iban().substr(0, 15),
			};
			await request.post('/api/users').send(user);
			const userInfo = await request.post('/api/users/login').send(user);
			request
				.get('/api/users')
				.set('authorization', '')
				.expect(res => {
					expect(res.status).to.be.equal(401);
					expect(res.body).property('message').which.is.a('string');
				})
				.catch(err => {
					expect(err.message).to.be.equal('not authenticated');
				});
		});

		it('it should respond with 404 Not Found - if the logged in user is the only one user who registered', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: faker.finance.iban().substr(0, 15),
			};
			await request.post('/api/users').send(user);
			const userInfo = await request.post('/api/users/login').send(user);
			request
				.get('/api/users')
				.set('authorization', `Bearer ${userInfo.body.token}`)
				.expect(res => {
					expect(res.status).to.be.equal(404);
					expect(res.body).property('error').which.is.a('string');
				})
				.catch(err => {
					expect(err.message).to.be.equal('user not found');
				});
		});
	});

	/**
	 * Create User Account - Test suite
	 */
	describe('- POST /api/users', () => {
		it('should respond with 201 if user account created ', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: faker.finance.iban().substr(0, 15),
			};
			request
				.post('/api/users')
				.send(user)
				.expect(res => {
					expect(res.status).to.be.equal(201);
					expect(res.body).to.be.an('object');
					expect(res.body).property('user').to.be.an('object');
					expect(res.body.user).to.have.property('id');
					expect(res.body.user)
						.to.have.property('username')
						.which.is.a('string');
					expect(res.body.user)
						.to.have.property('createdAt')
						.which.is.a('string');
				});
		});

		it('should respond with 409 if user already exists', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: faker.finance.iban().substr(0, 15),
			};
			await request.post('/api/users').send(user);
			request
				.post('/api/users')
				.send(user)
				.expect(res => {
					expect(res.headers)
						.property('Content-Type')
						.to.be.equal('application/json');
					expect(res.status).to.be.equal(409);
					expect(res.body).to.be.a('object');
					expect(res.body).property('message').to.be.a('string');
					expect(res.body).property('errors').to.be.an('array');
					expect(res.body.errors[0]).property('path').to.be.equal('username');
					expect(res.body.errors[0]).property('message').to.be.a('string');
				})
				.catch(err => {
					expect(err.code).to.be.equal('23505');
				});
		});

		it('should respond with 400 if an invalid username provided', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[0-9]/i),
				password: faker.finance.iban().substr(0, 15),
			};
			request
				.post('/api/users')
				.send(user)
				.expect(res => {
					expect(res.status).to.be.equal(400);
					expect(res.body).to.be.a('object');
					expect(res.body).property('message').to.be.a('string');
					expect(res.body).property('errors').to.be.an('array');
					expect(res.body.errors[0]).property('path').to.be.a('string');
					expect(res.body.errors[0]).property('message').to.be.a('string');
				})
				.catch(err => {
					expect(err.message).to.be.equal('Invalid request format');
				});
		});

		it('should respond with 400 if username is empty', async () => {
			const user = {
				username: '',
				password: faker.finance.iban().substr(0, 15),
			};
			request
				.post('/api/users')
				.send(user)
				.expect(res => {
					expect(res.status).to.be.equal(400);
					expect(res.body).to.be.a('object');
					expect(res.body).property('message').to.be.a('string');
					expect(res.body).property('errors').to.be.an('array');
					expect(res.body.errors[0]).property('path').to.be.equal('username');
					expect(res.body.errors[0]).property('message').to.be.a('string');
				})
				.catch(err => {
					expect(err.message).to.be.equal('Invalid request format');
				});
		});

		it('should respond with 400 if password is empty', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: '',
			};
			request
				.post('/api/users')
				.send(user)
				.expect(res => {
					expect(res.status).to.be.equal(400);
					expect(res.body).to.be.a('object');
					expect(res.body).property('message').to.be.a('string');
					expect(res.body).property('errors').to.be.an('array');
					expect(res.body.errors[0]).property('path').to.be.equal('password');
					expect(res.body.errors[0]).property('message').to.be.a('string');
				})
				.catch(err => {
					expect(err.message).to.be.equal('Invalid request format');
				});
		});
	});

	/**
	 * Create User Account - Test suite
	 */
	describe('- POST /api/users/login', () => {
		it('should respond with 200 once user provided right credentials ', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: faker.finance.iban().substr(0, 15),
			};
			await request.post('/api/users').send(user);
			request
				.post('/api/users/login')
				.send(user)
				.expect(res => {
					expect(res.status).to.be.equal(200);
					expect(res.body).to.be.an('object');
					expect(res.body).property('user').to.be.an('object');
					expect(res.body).property('message').to.be.a('string');
					expect(res.body).property('token').to.be.a('string');
					expect(res.body.user).to.have.property('id');
					expect(res.body.user)
						.to.have.property('username')
						.which.is.a('string');
					expect(res.body.user)
						.to.have.property('createdAt')
						.which.is.a('string');
				});
		});

		it('should respond with 400 if an invalid username provided', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[0-9]/i),
				password: faker.finance.iban().substr(0, 15),
			};
			request
				.post('/api/users/login')
				.send(user)
				.expect(res => {
					expect(res.status).to.be.equal(400);
					expect(res.body).to.be.a('object');
					expect(res.body).property('message').to.be.a('string');
					expect(res.body).property('errors').to.be.an('array');
					expect(res.body.errors[0]).property('path').to.be.a('string');
					expect(res.body.errors[0]).property('message').to.be.a('string');
				})
				.catch(err => {
					expect(err.message).to.be.equal('Invalid request format');
				});
		});

		it('should respond with 400 if username is empty', async () => {
			const user = {
				username: '',
				password: faker.finance.iban().substr(0, 15),
			};
			request
				.post('/api/users/login')
				.send(user)
				.expect(res => {
					expect(res.status).to.be.equal(400);
					expect(res.body).to.be.a('object');
					expect(res.body).property('message').to.be.a('string');
					expect(res.body).property('errors').to.be.an('array');
					expect(res.body.errors[0]).property('path').to.be.equal('username');
					expect(res.body.errors[0]).property('message').to.be.a('string');
				})
				.catch(err => {
					expect(err.message).to.be.equal('Invalid request format');
				});
		});

		it('should respond with 400 if password is empty', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: '',
			};
			request
				.post('/api/users/login')
				.send(user)
				.expect(res => {
					expect(res.status).to.be.equal(400);
					expect(res.body).to.be.a('object');
					expect(res.body).property('message').to.be.a('string');
					expect(res.body).property('errors').to.be.an('array');
					expect(res.body.errors[0]).property('path').to.be.equal('password');
					expect(res.body.errors[0]).property('message').to.be.a('string');
				})
				.catch(err => {
					expect(err.message).to.be.equal('Invalid request format');
				});
		});

		it("should respond with 401 if password doesn't match ", async () => {
			const user = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: faker.finance.iban().substr(0, 15),
			};
			await request.post('/api/users').send(user);
			request
				.post('/api/users/login')
				.send({ ...user, password: faker.name.firstName() })
				.expect(res => {
					expect(res.status).to.be.equal(401);
					expect(res.body).to.be.an('object');
					expect(res.body).property('message').to.be.a('string');
				})
				.catch(err => {
					expect(err.message).to.be.equal('password not match');
				});
		});

		it('should respond with 404 if the username is not found ', async () => {
			const user = {
				username: faker.internet.password(8, false, /^[a-z]/g),
				password: faker.finance.iban().substr(0, 15),
			};
			request
				.post('/api/users/login')
				.send(user)
				.expect(res => {
					expect(res.status).to.be.equal(404);
					expect(res.body).to.be.an('object');
					expect(res.body).property('error').to.be.a('string');
				})
				.catch(err => {
					expect(err.message).to.be.equal('user not found');
				});
		});
	});
});
