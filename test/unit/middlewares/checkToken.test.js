const chai = require('chai');
const chaiThings = require('chai-things');
const chaiLike = require('chai-like');
const faker = require('faker');
const path = require('path');
const { default: checkToken } = require('../../../middlewares/checkToken');


const server = require(path.resolve('server'));
const request = require('supertest')(server);
const { expect } = chai;
chai.use(chaiThings);
chai.use(chaiLike);

describe('#CheckToken Middleware', () => {
    it("should return false if the authorization is undefined", async () => {
        const user = { username: faker.internet.password(8, false, /^[a-z]/g), password: faker.finance.iban().substr(0, 15) };
        await request.post('/api/users').send(user);
        const userInfo = await request.post('/api/users/login').send(user);
        expect(await checkToken({ headers: {} }, {})).to.be.equal(false);
        expect(await checkToken({ headers: { authorization: `Bearer${userInfo.body.token}` } }, {})).to.be.equal(false);
    });
});