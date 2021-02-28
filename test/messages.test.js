const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const server = require('../server');
const User = require('../models/userModel');

chai.use(chaiHttp);
// Messages block
describe.skip('Messages', async () => {
	/*
	 * Test for /GET
	 */
	describe.skip('/GET messages', () => {
		it('it should GET all the messages', done => {
			chai
				.request(server)
				.post('/api/messages')
				.send(getMessage)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});
	/*
	 * Test for /POST
	 */
	describe('/POST message', () => {
		it('should respond with 201 if the message was created successfully ', async () => {
			const user = {
				username: faker.name.firstName(),
				password: faker.finance.iban().substr(0, 15),
			};
			const user1 = {
				username: faker.name.firstName(),
				password: faker.finance.iban().substr(0, 15),
			};
			const data = { receiver: user1.username, message: faker.lorem.text(10) };
			chai
				.request(server)
				.post('/api/users')
				.send(user)
				.end((err, res) => {
					chai
						.request(server)
						.post('/api/users')
						.send(user1)
						.end((err, res) => {
							chai
								.request(server)
								.post('/api/users/login')
								.send(user)
								.end((err, res) => {
									console.log('===');
									chai
										.request(server)
										.post('/api/message')
										.set('authorization', `Bearer ${res.body.token}`)
										.send(data)
										.end((err, res) => {
											console.log('===');
											res.should.have.status(201);
											res.body.should.be.a('object');
											res.body.should.have.property('sender');
											res.body.should.have.property('receiver');
											res.body.should.have.property('message');
											res.body.should.have.property('id');
										});
								});
						});
				});
		});

		it('should respond with 404 if the receiver username is not found', async () => {
			const user = {
				username: faker.name.firstName(),
				password: faker.finance.iban().substr(0, 15),
			};
			const user1 = {
				username: faker.name.firstName(),
				password: faker.finance.iban().substr(0, 15),
			};
			const data = {
				receiver: faker.internet.password(8, false, /^[0-9]/i),
				message: faker.lorem.text(10),
			};
			chai
				.request(server)
				.post('/api/users')
				.send(user)
				.end((err, res) => {
					chai
						.request(server)
						.post('/api/users')
						.send(user1)
						.end((err, res) => {
							chai
								.request(server)
								.post('/api/users/login')
								.send(user)
								.end((err, res) => {
									console.log('===');
									chai
										.request(server)
										.post('/api/messages')
										.set('authorization', `Bearer ${res.body.token}`)
										.send(data)
										.end((err, res) => {
											console.log('===error');
											res.should.have.status(404);
											// res.body.should.be.a('object');
											// res.body.should.have.property('sender');
											// res.body.should.have.property('receiver');
											// res.body.should.have.property('message');
											// res.body.should.have.property('id');
										});
								});
						});
				});
		});

		it.skip('should respond with 400 if the receiver name is invalid', async () => {
			const user = {
				username: faker.name.firstName(),
				password: faker.finance.iban().substr(0, 15),
			};
			const user1 = {
				username: faker.name.firstName(),
				password: faker.finance.iban().substr(0, 15),
			};
			const data = {
				receiver: faker.internet.password(8, false, /^[0-9]/i),
				message: faker.lorem.text(10),
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
							chai
								.request(server)
								.post('/api/messages')
								.set('authorization', `Bearer ${res.body.token}`)
								.send(data)
								.end((err, res) => {
									// res.should.have.status(400);
									// res.body.should.be.a('object');
									// res.body.should.have.a.property("message").which.is.an("string");
									// res.body.should.have.a.property("errors").which.is.an("array");
									// res.body.errors[0].to.have.property("path");
									// res.body.errors[0].to.have.property("message");
									process.exit(0);
								});
						});
				});
		});

		it.skip('should respond with 401 if the user is not authenticated', () => {
			const data = {
				receiver: receiver,
				message: faker.lorem.text(10),
			};
			chai
				.request(server)
				.post('/api/messages')
				.send(data)
				.end((err, res) => {
					res.should.have.have.status(401);
					res.body.should.have.a.property('message').which.is.a('string');
				});
		});

		it.skip('should respond with 401 if the user provide the wrong token', () => {
			const data = {
				receiver: receiver,
				message: faker.lorem.text(10),
			};
			chai
				.request(server)
				.post('/api/messages')
				.send(data)
				.set('authorization', faker.internet.password(10, false, /^[\W]+/i))
				.end((err, res) => {
					res.should.have.have.status(401);
					res.body.should.have.a.property('message').which.is.a('string');
					process.exit(0);
				});
		});
	});
});
