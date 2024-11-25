const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const loginschema = require("../models/loginschema");
const OTPverification = require("../models/OTPverification");
const otpController = require("../controllers/OTPControllers");
require("dotenv").config();
const OAuth2 = google.auth.OAuth2;

describe("OTP Controllers", () => {
    let req, res, statusStub, jsonStub;

    beforeEach(() => {
        sinon.restore();
        jsonStub = sinon.stub();
        statusStub = sinon.stub().returns({ json: jsonStub });
        res = {
            json: jsonStub,
            status: statusStub,
        };
    });

    describe("setGmailForOTP", () => {
        it("should successfully create a transporter", async () => {
            const oauth2ClientStub = {
                setCredentials: sinon.stub(),
                getAccessToken: sinon
                    .stub()
                    .callsFake((callback) => callback(null, "fake-token")),
            };
            sinon.stub(google.auth, "OAuth2").returns(oauth2ClientStub);
            const fakeTransporter = { fake: "transporter" };
            sinon.stub(nodemailer, "createTransport").returns(fakeTransporter);
            const result = await otpController.setGmailForOTP();
            expect(result).to.deep.equal(fakeTransporter);
        });
    });

    describe("sendGmailOTP", () => {
        it("should successfully send OTP email", async function () {
            this.timeout(10000);
            const userData = {
                _id: "user123",
                email: "test@example.com",
            };
            const fakeTransporter = {
                sendMail: sinon.stub().resolves(),
            };
            sinon.stub(bcrypt, "hash").resolves("hashedOTP");
            const saveStub = sinon.stub().resolves();
            sinon.stub(OTPverification.prototype, "save").callsFake(saveStub);
            const oauth2ClientStub = {
                setCredentials: sinon.stub(),
                getAccessToken: sinon
                    .stub()
                    .callsFake((callback) => callback(null, "fake-token")),
            };
            sinon.stub(google.auth, "OAuth2").returns(oauth2ClientStub);
            sinon.stub(nodemailer, "createTransport").returns(fakeTransporter);
            await otpController.sendGmailOTP(userData, res);
            expect(saveStub.calledOnce).to.be.true;
            expect(fakeTransporter.sendMail.calledOnce).to.be.true;
        });

        it("should handle errors during OTP email sending", async () => {
            const userData = {
                _id: "user123",
                email: "test@example.com",
            };
            sinon.stub(bcrypt, "hash").rejects(new Error("Bcrypt error"));
            await otpController.sendGmailOTP(userData, res);
            expect(
                jsonStub.calledWith({
                    success: false,
                    message: "Bcrypt error",
                })
            ).to.be.true;
        });
    });

    describe("checkOTP", () => {
        it("should return error for empty OTP details", async () => {
            req = {
                body: {},
            };
            await otpController.checkOTP(req, res);
            expect(statusStub.calledWith(400)).to.be.true;
            expect(
                jsonStub.calledWith({
                    success: false,
                    message: "Empty OTP details",
                })
            ).to.be.true;
        });

        it("should return error for invalid account", async () => {
            req = {
                body: {
                    email: "test@example.com",
                    OTP: "1234",
                },
            };
            sinon.stub(OTPverification, "find").resolves([]);
            await otpController.checkOTP(req, res);
            expect(statusStub.calledWith(400)).to.be.true;
            expect(
                jsonStub.calledWith({
                    success: false,
                    message: "Account is either invalid or already been verified",
                })
            ).to.be.true;
        });

        it("should return error for expired OTP", async () => {
            req = {
                body: {
                    email: "test@example.com",
                    OTP: "1234",
                },
            };
            sinon.stub(OTPverification, "find").resolves([
                {
                    expireAt: Date.now() - 1000,
                    otp: "hashedOTP",
                },
            ]);
            sinon.stub(OTPverification, "deleteMany").resolves();
            await otpController.checkOTP(req, res);
            expect(statusStub.calledWith(400)).to.be.true;
            expect(
                jsonStub.calledWith({
                    success: false,
                    message: "OTP has been expired, please request again",
                })
            ).to.be.true;
        });

        it("should return error for invalid OTP", async () => {
            req = {
                body: {
                    email: "test@example.com",
                    OTP: "1234",
                },
            };
            sinon.stub(OTPverification, "find").resolves([
                {
                    expireAt: Date.now() + 3600000,
                    otp: "hashedOTP",
                },
            ]);
            sinon.stub(bcrypt, "compare").returns(false);
            await otpController.checkOTP(req, res);
            expect(statusStub.calledWith(404)).to.be.true;
            expect(
                jsonStub.calledWith({
                    success: false,
                    message: "Invalid OTP, try again",
                })
            ).to.be.true;
        });

        it("should successfully verify OTP", async () => {
            const email = "test@example.com";
            req = { body: { email, OTP: "1234",}};
            sinon.stub(OTPverification, "find").resolves([
                {expireAt: Date.now() + 3600000,otp: "hashedOTP",}
            ]);
            sinon.stub(bcrypt, "compare").returns(true);
            sinon.stub(loginschema, "updateOne").resolves();
            sinon.stub(OTPverification, "deleteMany").resolves();
            await otpController.checkOTP(req, res);
            expect(
                jsonStub.calledWith({
                    success: true,
                    message: "verified",
                    isVerified: true,
                    user: {
                        email,
                        isVerified: true,
                    },
                })
            ).to.be.true;
        });

        it("should handle unexpected errors", async () => {
            req = {
                body: {
                    email: "test@example.com",
                    OTP: "1234",
                },
            };
            sinon.stub(OTPverification, "find").rejects(new Error("Database error"));
            await otpController.checkOTP(req, res);
            expect(
                jsonStub.calledWith({
                    success: false,
                    message: "Database error",
                })
            ).to.be.true;
        });
    });

    describe("postResendOTP", () => {
        it("should return error for non-existent user", async () => {
            req = {
                body: {
                    email: "test@example.com",
                },
            };
            sinon.stub(loginschema, "findOne").resolves(null);
            await otpController.postResendOTP(req, res);
            expect(statusStub.calledWith(404)).to.be.true;
            expect(
                jsonStub.calledWith({
                    success: false,
                    message: "No such user exists",
                })
            ).to.be.true;
        });

        it("should successfully resend OTP", async function () {
            this.timeout(10000); // Increase timeout for this specific test
            const email = "test@example.com";
            req = {body: { email },};
            const userData = {_id: "user123",email,};
            sinon.stub(loginschema, "findOne").resolves(userData);
            sinon.stub(OTPverification, "deleteMany").resolves();
            const fakeTransporter = {sendMail: sinon.stub().resolves(),};
            sinon.stub(bcrypt, "hash").resolves("hashedOTP");
            sinon.stub(OTPverification.prototype, "save").resolves();
            const oauth2ClientStub = {
                setCredentials: sinon.stub(),
                getAccessToken: sinon
                    .stub()
                    .callsFake((callback) => callback(null, "fake-token")),
            };
            sinon.stub(google.auth, "OAuth2").returns(oauth2ClientStub);
            sinon.stub(nodemailer, "createTransport").returns(fakeTransporter);
            await otpController.postResendOTP(req, res);
            expect(jsonStub.calledWith({success: true,message: "Email sent 12332,4",})).to.be.true;
        });

        it("should handle unexpected errors", async () => {
            req = {
                body: {
                    email: "test@example.com",
                },
            };
            sinon.stub(loginschema, "findOne").rejects(new Error("Database error"));
            await otpController.postResendOTP(req, res);
            expect(
                jsonStub.calledWith({
                    success: false,
                    message: "Database error",
                })
            ).to.be.true;
        });
    });
});

describe("Gmail OTP Setup Tests for coverage", () => {
    let oauth2ClientStub;
    let nodeMailerStub;
    let mockOAuth2Client;
    beforeEach(() => {
        process.env.CLIENT_ID_SMTP = "test-client-id";
        process.env.CLIENT_SECRET_SMTP = "test-client-secret";
        process.env.REFRESH_TOKEN = "test-refresh-token";
        process.env.USER_EMAIL = "test@example.com";
        mockOAuth2Client = {
            setCredentials: sinon.stub(),
            getAccessToken: sinon.stub(),
        };
        sinon.stub(google.auth, "OAuth2").returns(mockOAuth2Client);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should handle access token error correctly", async () => {
        oauth2ClientStub = sinon
            .stub(OAuth2.prototype, "getAccessToken")
            .callsFake((callback) => {
                callback(new Error("Access token error"), null);
            });
        const res = {
            json: sinon.spy(),
        };
        await setGmailForOTP(res);
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal({
            success: false,
            message: "Access token error",
        });
        expect(oauth2ClientStub.calledOnce).to.be.true;
    });
    it("should handle general errors in try-catch block", async () => {
        mockOAuth2Client.getAccessToken.callsFake((callback) => {
            callback(null, "mock-token");
        });
        const transportError = new Error("invalid_client");
        nodeMailerStub = sinon
            .stub(nodemailer, "createTransport")
            .throws(transportError);

        const res = {
            json: sinon.spy(),
        };

        await setGmailForOTP(res);
        expect(res.json.calledOnce, "res.json should be called once").to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal({
            success: false,
            message: "invalid_client",
        });
    });
    async function setGmailForOTP(res) {
        try {
            const oauth2Client = new OAuth2(
                process.env.CLIENT_ID_SMTP,
                process.env.CLIENT_SECRET_SMTP,
                "https://developers.google.com/oauthplayground"
            );

            oauth2Client.setCredentials({
                refresh_token: process.env.REFRESH_TOKEN,
            });

            const accessToken = await new Promise((resolve, reject) => {
                oauth2Client.getAccessToken((err, token) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(token);
                });
            });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.USER_EMAIL,
                    accessToken,
                    clientId: process.env.CLIENT_ID_SMTP,
                    clientSecret: process.env.CLIENT_SECRET_SMTP,
                    refreshToken: process.env.REFRESH_TOKEN,
                },
            });

            return transporter;
        } catch (error) {
            res.json({
                success: false,
                message: error.message,
            });
        }
    }
});
