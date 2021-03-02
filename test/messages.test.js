const chai = require('chai');
const chaiThings = require('chai-things');
const chaiLike = require('chai-like');
const faker = require('faker');
const path = require('path');
const { default: checkToken } = require('../middlewares/checkToken');

const server = require(path.resolve('server'));
const request = require('supertest')(server);

const {
  expect
} = chai;
chai.use(chaiThings);
chai.use(chaiLike);

// Messages block
describe('#Messages', async () => {
  /*
   * Test for /GET
   */
  describe('- GET /api/messages', () => {
    it('should respond with 200 with all the messages', async () => {
      const user = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15)
      };
      const user1 = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15)
      };
      const data = {
        receiver: user1.username, message: faker.lorem.text(10)
      };
      await request.post('/api/users').send(user);
      await request.post('/api/users').send(user1);
      const userInfo = await request.post('/api/users/login').send(user);
      await request.post('/api/message').set('authorization', `Bearer ${userInfo.body.token}`).send(data);
      request.post('/api/messages')
        .send({
          sender: user1.username
        })
        .set('authorization', `Bearer ${userInfo.body.token}`)
        .expect((res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an('array');
        });
    });

    it('should respond with 400 if sender is not provided', async () => {
      const user = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15)
      };
      const user1 = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15)
      };
      const data = {
        receiver: faker.internet.password(8, false, /^[0-9]/i), message: faker.lorem.text(10),
      };
      await request.post('/api/users').send(user);
      await request.post('/api/users').send(user1);
      const userInfo = await request.post('/api/users/login').send(user);
      await request.post('/api/message').set('authorization', `Bearer ${userInfo.body.token}`).send(data);
      request.post('/api/messages')
        .set('authorization', `Bearer ${userInfo.body.token}`)
        .send({})
        .expect((res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).property('message').to.be.a('string');
          expect(res.body).property('errors').to.be.an('array');
          expect(res.body.errors[0]).property('path').to.be.equal('receiver');
          expect(res.body.errors[0]).property('message').to.be.a('string');
        })
        .catch((err) => {
          expect(err.message).to.be.equal("Invalid request format")
        });
    });

    it('should respond with 400 if sender is invalid', async () => {
      const user = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15)
      };
      const user1 = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15)
      };
      const data = {
        receiver: faker.internet.password(8, false, /^[0-9]/i), message: faker.lorem.text(10),
      };
      await request.post('/api/users').send(user);
      await request.post('/api/users').send(user1);
      const userInfo = await request.post('/api/users/login').send(user);
      await request.post('/api/message').set('authorization', `Bearer ${userInfo.body.token}`).send(data);
      request.post('/api/messages')
        .set('authorization', `Bearer ${userInfo.body.token}`)
        .send({ sender: faker.internet.password(8, false, /^[\W]/i) })
        .expect((res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).property('message').to.be.a('string');
          expect(res.body).property('errors').to.be.an('array');
          expect(res.body.errors[0]).property('path').to.be.equal('receiver');
          expect(res.body.errors[0]).property('message').to.be.a('string');
        })
        .catch((err) => {
          expect(err.message).to.be.equal("Invalid request format")
        });
    });

    it('should respond with 401 if user is not authenticated', async () => {
      const user = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15)
      };
      const user1 = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15)
      };
      const data = {
        receiver: user1.username, message: faker.lorem.text(10)
      };
      await request.post('/api/users').send(user);
      await request.post('/api/users').send(user1);
      const userInfo = await request.post('/api/users/login').send(user);
      await request.post('/api/message').set('authorization', `Bearer ${userInfo.body.token}`).send(data);
      request.post('/api/messages')
        .send({ sender: user1.username })
        .set('authorization', '')
        .expect((res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an('array');
        });
    });

    it('should respond with 404 if no message found sent between send and receiver', async () => {
      const user = {
        username: faker.internet.password(8, false, /^[a-z]/g),
        password: faker.finance.iban().substr(0, 15)
      };
      const user1 = {
        username: faker.internet.password(8, false, /^[a-z]/g),
        password: faker.finance.iban().substr(0, 15)
      };
      await request.post('/api/users').send(user);
      await request.post('/api/users').send(user1);
      const userInfo = await request.post('/api/users/login').send(user);
      request.post('/api/messages')
        .send({
          sender: user1.username
        })
        .set('authorization', `Bearer ${userInfo.body.token}`)
        .expect((res) => {
          expect(res.status).to.be.equal(401);
          expect(res.body).property('message').which.is.a('string');
        })
        .catch((err) => {
          expect(err.message).to.be.equal("not authenticated")
        });
    });

    it('should respond with 404 if the receiver not found', async () => {
      const user = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15),
      };
      await request.post('/api/users').send(user);
      const userInfo = await request.post('/api/users/login').send(user);
      request
        .post('/api/messages')
        .set('authorization', `Bearer ${userInfo.body.token}`)
        .send({ sender:  faker.internet.password(8, false, /^[a-z]+$/g)})
        .expect((res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body).to.be.an('object');
        })
        .catch((err) => {
          expect(err.message).to.be.equal("receiver not found")
        });
    });
  });
  /*
   * Test for /POST
   */
  describe('- POST /api/message', () => {
    it('should respond with 201 if the message was created successfully ', async () => {
      const user = {
        username: faker.internet.password(8, false, /^[a-z]/g),
        password: faker.finance.iban().substr(0, 15)
      };
      const user1 = {
        username: faker.internet.password(8, false, /^[a-z]/g),
        password: faker.finance.iban().substr(0, 15)
      };
      const data = {
        receiver: user1.username, message: faker.lorem.text(10)
      };
      await request.post('/api/users').send(user);
      await request.post('/api/users').send(user1);
      const userInfo = await request.post('/api/users/login').send(user);
      request.post('/api/message')
        .set('authorization', `Bearer ${userInfo.body.token}`)
        .send(data)
        .expect((res) => {
          expect(res.status).to.be.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body).property('sender').to.be.a('string');
          expect(res.body).property('receiver').to.be.a('string');
          expect(res.body).property('message').to.be.a('string');
          expect(res.body).property('id').to.be.a('string');
        });
    });

    it('should respond with 400 if the receiver name is invalid', async () => {
      const user = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15),
      };
      const data = {
        receiver: faker.internet.password(8, false, /^[0-9]/i), message: faker.lorem.text(10),
      };
      await request.post('/api/users').send(user);
      const userInfo = await request.post('/api/users/login').send(user);
      request
        .post('/api/message')
        .set('authorization', `Bearer ${userInfo.body.token}`)
        .send(data)
        .expect((err, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).property('message').to.be.a('string');
          expect(res.body).property('errors').to.be.an('array');
          expect(res.body.errors[0]).property('path').to.be.equal('receiver');
          expect(res.body.errors[0]).property('message').to.be.a('string');
        })
        .catch((err) => {
          expect(err.message).to.be.equal("Invalid request format")
        });
    });

    it('should respond with 404 if the receiver username is not found', async () => {
      const user = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15),
      };
      const user1 = {
        username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15),
      };
      const data = {
        receiver: faker.internet.password(8, false, /^[0-9]/i), message: faker.lorem.text(10),
      };
      await request.post('/api/users').send(user);
      const userInfo = await request.post('/api/users/login').send(user);
      request
        .post('/api/message')
        .set('authorization', `Bearer ${userInfo.body.token}`)
        .send(data)
        .expect((res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body).to.be.an('object');
        })
        .catch((err) => {
          expect(err.message).to.be.equal("receiver not found")
        });
    });

    it('should respond with 401 if the user is not authenticated', async () => {
      const data = {
        receiver: faker.internet.password(8, false, /^[a-zA-Z]+/i),
        message: faker.lorem.text(10),
      };
      request.post('/api/message')
        .send(data)
        .expect((res) => {
          expect(res.status).to.be.equal(401);
          expect(res.body).property('message').which.is.a('string');
        })
        .catch((err) => {
          expect(err.message).to.be.equal("not authenticated")
        });
    });

    it('should respond with 401 if the user provide the wrong token', async () => {
      const user = {
        username: faker.internet.password(8, false, /^[a-z]/g),
        password: faker.finance.iban().substr(0, 15)
      };
      const user1 = {
        username: faker.internet.password(8, false, /^[a-z]/g),
        password: faker.finance.iban().substr(0, 15)
      };
      const data = {
        receiver: user1.username, message: faker.lorem.text(10)
      };
      await request.post('/api/users').send(user);
      await request.post('/api/users').send(user1);
      const userInfo = await request.post('/api/users/login').send(user);
      request
        .post('/api/message')
        .send(data)
        .set('authorization', faker.internet.password(10, false, /^[\W]+/i))
        .expect((res) => {
          expect(res.status).to.be.equal(401);
          expect(res.body).property('message').which.is.a('string');
        })
        .catch((err) => {
          expect(err.message).to.be.equal("not authenticated")
        });
    });
  });
});
