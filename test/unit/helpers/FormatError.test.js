const chai = require('chai');
const chaiThings = require('chai-things');
const chaiLike = require('chai-like');
const path = require('path');
const { formatError } = require(path.resolve("helpers/FormatError"));
const { expect } = chai;
chai.use(chaiThings);
chai.use(chaiLike);

describe('- FormatApiError(error:object):object', () => {
    it("should return object which contains code:400 for any invalid request format", async () => {
        const error = { message: "Invalid request format", errors: [{ path: "username", message: "username is required" }] };
        expect(formatError(error)).to.be.an("object");
        expect(formatError(error)).property("code").to.be.equal(400);
        expect(formatError(error)).property("body").to.be.an("object");
        expect(formatError(error).body).property("message").to.be.a("string");
        expect(formatError(error).body).property("errors").to.be.an("array");
    });

    it("should return object which contains code:500 for any internal server issue", async () => {
        const error = { message: "Internal server error", errors: [] };
        expect(formatError(error)).to.be.an("object");
        expect(formatError(error)).property("code").to.be.equal(500);
        expect(formatError(error)).property("body").to.be.an("object");
        expect(formatError(error).body).property("message").to.be.a("string");
        expect(formatError(error).body).property("errors").to.be.an("array");
    });
})
