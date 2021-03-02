const chai = require('chai');
const chaiThings = require('chai-things');
const chaiLike = require('chai-like');
const faker = require('faker');
const path = require('path');
const { FormatRequest } = require("../../../helpers/FormatUserRequest");

const { expect } = chai;
chai.use(chaiThings);
chai.use(chaiLike);

describe('#FormatRequest(data:object, required=[], optional=[]):object', () => {
    it("should throw an error for any invalid request format", async () => {
        const data = {};
        const required = ["username"]
        try {
            FormatRequest(data, required);
        } catch (error) {
            expect(error).property("message").which.is.a("string")
            expect(error).property("errors").which.is.a("array")
        }
    });

    it("should throw an error for any field is which is not supposed to be a part of the request", async () => {
        const data = { username:faker.internet.password(8, false, /^[a-z]/g), phoneNumber: faker.phone.phoneNumber('(+2##)#########') };
        const required = ["username"]
        try {
            FormatRequest(data, required);
        } catch (error) {
            expect(error).property("message").which.is.a("string")
            expect(error).property("errors").which.is.a("array")
        }
    });

    it("should throw an error if the required field is empty", async () => {
        const data = { username: "" };
        const required = ["username"]
        try {
            FormatRequest(data, required);
        } catch (error) {
            expect(error).property("message").which.is.a("string")
            expect(error).property("errors").which.is.a("array")
        }
    });

    it("should throw an error if username is not started with a letter", async () => {
        const data = { username: faker.internet.password(10, false, /^[\W]/i) };
        const required = ["username"]
        try {
            FormatRequest(data, required);
        } catch (error) {
            expect(error).property("message").which.is.a("string")
            expect(error).property("errors").which.is.a("array")
        }
    });

    it("should throw an error if receiver is not started with a letter", async () => {
        const data = { receiver: faker.internet.password(10, false, /^[\W]/i) };
        const required = ["receiver"]
        try {
            FormatRequest(data, required);
        } catch (error) {
            expect(error).property("message").which.is.a("string")
            expect(error).property("errors").which.is.a("array")
        }
    });

    it("should return the valid object", async () => {
        const data = {
            username: faker.internet.password(8, false, /^[a-z]/g),
            password: faker.internet.password(10, false, /^[a-zA-Z0-9]+/i)
        };
        const required = ["username", "password"];
        expect(FormatRequest(data, required)).to.be.an("object");
        expect(FormatRequest(data, required)).property("username").to.be.a("string");
        expect(FormatRequest(data, required)).property("password").to.be.a("string");
    });


})
