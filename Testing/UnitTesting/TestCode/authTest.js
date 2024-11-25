const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const { setUser, getUser, setAdmin, getAdmin } = require("../service/auth"); // Adjust the path as needed

describe("JWT Token Functions", () => {
    const mockUser = {
        _id: "123456",
        email: "test@example.com",
        username: "testuser",
        admin: false,
    };
    const adminUser = {
        _id: "admin123",
        email: "admin@example.com",
        username: "adminuser",
        admin: true,
    };
    const userKey = "user-secret-key";
    const adminKey = "admin-secret-key";

    before(() => {
        sinon.stub(process.env, "KEY").value(userKey);
        sinon.stub(process.env, "AKEY").value(adminKey);
    });

    after(() => {
        sinon.restore();
    });

    describe("setUser", () => {
        it("should create a valid JWT for a user", () => {
            const token = setUser(mockUser);
            const decoded = jwt.verify(token, userKey);
            expect(decoded).to.include({
                _id: mockUser._id,
                email: mockUser.email,
                username: mockUser.username,
                admin: mockUser.admin,
            });
        });
    });

    describe("getUser", () => {
        it("should return decoded user data for a valid token", () => {
            const token = jwt.sign(mockUser, userKey);
            const decoded = getUser(token);
            expect(decoded).to.include({
                _id: mockUser._id,
                email: mockUser.email,
                username: mockUser.username,
                admin: mockUser.admin,
            });
        });

        it("should return null for an invalid token", () => {
            const token = "invalid.token.value";
            const result = getUser(token);
            expect(result).to.be.null;
        });

        it("should return null for a missing token", () => {
            const result = getUser(null);
            expect(result).to.be.null;
        });
    });

    describe("setAdmin", () => {
        it("should create a valid JWT for an admin", () => {
            const token = setAdmin(adminUser);
            const decoded = jwt.verify(token, adminKey);
            expect(decoded).to.include({
                _id: adminUser._id,
                email: adminUser.email,
                username: adminUser.username,
                admin: adminUser.admin,
            });
        });
    });

    describe("getAdmin", () => {
        it("should return decoded admin data for a valid token", () => {
            const token = jwt.sign(adminUser, adminKey);
            const decoded = getAdmin(token);
            expect(decoded).to.include({
                _id: adminUser._id,
                email: adminUser.email,
                username: adminUser.username,
                admin: adminUser.admin,
            });
        });

        it("should return null for an invalid token", () => {
            const token = "invalid.admin.token";
            const result = getAdmin(token);
            expect(result).to.be.null;
        });

        it("should return null for a missing token", () => {
            const result = getAdmin(null);
            expect(result).to.be.null;
        });
    });
});
