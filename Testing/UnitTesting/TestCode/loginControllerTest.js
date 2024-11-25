const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const loginschema = require('../models/loginschema');
const OTPverification = require('../models/OTPverification');
const { sendGmailOTP,setGmailForOTP } = require('../controllers/OTPControllers');
const { setUser } = require('../service/auth');
const { createLoginData,getUserDetails, checkLoginCredential, postNewPassword, postForgotPassword, logout, postPassword } = require('../controllers/loginControllers');
const auth = require('../service/auth')
const OTPControllers = require('../controllers/OTPControllers')
const expect = chai.expect;


const mockUser = {
    _id: "mockUserId",
    email: "test@example.com"
};

const mockRes = {
    json: sinon.spy(),
};

describe("Login Controller", () => {

    afterEach(() => {
        sinon.restore();
    });

    // Test for createLoginData function
    describe("createLoginData", () => {
        it("should return error if user already exists", async () => {
            sinon.stub(loginschema, 'findOne').resolves({ email: 'test@example.com' });
            const req = { body: { email: 'test@example.com', password: 'password', rpassword: 'password' } };
            const res = { json: sinon.spy() };

            await createLoginData(req, res);
            expect(res.json.calledWith({ success: false, message: "User is already registered, use a different email" })).to.be.true;
        });

        it("should return error if passwords do not match", async () => {
            sinon.stub(loginschema, 'findOne').resolves(null);
            const req = { body: { email: 'new@example.com', password: 'password', rpassword: 'notMatchingPassword' } };
            const res = { json: sinon.spy() };

            await createLoginData(req, res);
            expect(res.json.calledWith({ success: false, message: "Passwords do not match." })).to.be.true;
        });

        it("should create a new user and call sendGmailOTP when conditions are met", async () => {
            sinon.stub(loginschema, 'findOne').resolves(null);  // No existing user
            const hashStub = sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
            const saveStub = sinon.stub(loginschema.prototype, 'save').resolves({_id: 'newUserId',email: 'newuser@example.com',username: 'newuser'});
            const sendOTPStub = sinon.stub(OTPControllers, 'sendGmailOTP').resolves();
            const req = { body: { email: 'newuser@example.com', password: 'password123', rpassword: 'password123',username: 'newuser'} };
            const res = { json: sinon.spy(),status: sinon.stub().returnsThis()};
            await createLoginData(req, res);
            expect(hashStub.calledOnceWith('password123', 10)).to.be.true;
            expect(saveStub.calledOnce).to.be.true;
            expect(sendOTPStub.calledOnce).to.be.true;
            expect(res.json.calledWith({ success: true, message: "email sent successfully" })).to.be.true;
            hashStub.restore();
            saveStub.restore();
            sendOTPStub.restore();
        });
    
        it("should handle errors during user creation", async () => {
            sinon.stub(loginschema, 'findOne').resolves(null);  // No existing user
            const hashStub = sinon.stub(bcrypt, 'hash').throws(new Error('Hashing error'));
            const req = { body: { email: 'newuser@example.com', password: 'password123', rpassword: 'password123',username: 'newuser'} };
            const res = { json: sinon.spy()};
            await createLoginData(req, res);
            expect(res.json.calledWith(sinon.match({success: false,message: sinon.match("An error occurred during signup.")}))).to.be.true;
            hashStub.restore();
    });
});

describe("getUserDetails", () => {
    it("should return user details when user is authenticated", async () => {
        const mockUser = {_id: 'userId123',email: 'test@example.com',username: 'testuser'};
        const req = {user: mockUser};
        const res = {json: sinon.spy()};
        await getUserDetails(req, res);
        expect(res.json.calledWith({success: true,user: mockUser,message: "user found"})).to.be.true;
    });

    it("should handle errors during user detail retrieval", async () => {
        const req = {get user() {throw new Error("Simulated error"); // Simulate an error when accessing req.user
}};
        const res = {json: sinon.spy()};
        await getUserDetails(req, res);
        expect(res.json.calledWith({
            success: false,
            message: "error getting user"
        })).to.be.true;
    });
});

    // Test for checkLoginCredential function
describe("checkLoginCredential", () => {
        it("should return error if user not found", async () => {
            sinon.stub(loginschema, 'findOne').resolves(null);
            const req = { body: { email: 'notfound@example.com', password: 'password' } };
            const res = { json: sinon.spy() };

            await checkLoginCredential(req, res);
            expect(res.json.calledWith({ success: false, message: "Invalid email or password." })).to.be.true;
        });

        it("should return error if user not verified", async () => {
            sinon.stub(loginschema, 'findOne').resolves({ verified: false });
            const req = { body: { email: 'test@example.com', password: 'password' } };
            const res = { json: sinon.spy() };

            await checkLoginCredential(req, res);
            expect(res.json.calledWith({ success: false, message: "User is not verified" })).to.be.true;
        });

        it("should log in user if credentials are correct", async () => {
            const user = { email: 'test@example.com', password: 'hashedPassword', verified: true };
            sinon.stub(loginschema, 'findOne').resolves(user);
            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(auth, 'setUser').returns('mockToken');
            const req = { body: { email: 'test@example.com', password: 'hashedpassword' } };
            const res = { json: sinon.spy(), cookie: sinon.spy() };

            await checkLoginCredential(req, res);
            expect(res.json.calledWith({ success: true, message: "logged in successfully", user: user })).to.be.true;
        });

        it("should refuse login is password is wrong", async () => {
            const user = { email: 'test@example.com', password: 'hashedPassword', verified: true };
            sinon.stub(loginschema, "findOne").rejects(new Error("Database error"));
            const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
            const res = { json: sinon.spy()};

            await checkLoginCredential(req, res);
            expect(res.json.calledWith({ success: false, error: "Database error"})).to.be.true;
            //expect(res.cookie.calledWith("uid", "mockToken")).to.be.true;
        });

        it("should give error is database error", async () => {
            const user = { email: 'test@example.com', password: 'hashedPassword', verified: true };
            sinon.stub(loginschema, 'findOne').resolves(user);
            sinon.stub(bcrypt, 'compare').resolves(false);
            const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
            const res = { json: sinon.spy()};

            await checkLoginCredential(req, res);
            expect(res.json.calledWith({ success: false, message: "Invalid email or password."})).to.be.true;
            //expect(res.cookie.calledWith("uid", "mockToken")).to.be.true;
        });

        it("should log in admin user if credentials are correct", async () => {
            const user = { email: 'test@example.com', password: 'hashedPassword', verified: true, admin:true };
            sinon.stub(loginschema, 'findOne').resolves(user);
            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(auth, 'setUser').returns('mockToken');
            sinon.stub(auth, 'setAdmin').returns('mockTokenAdmin');
            const req = { body: { email: 'test@example.com', password: 'hashedpassword' } };
            const res = { json: sinon.spy(), cookie: sinon.spy() };

            await checkLoginCredential(req, res);
            expect(res.json.calledWith({ success: true, message: "logged in successfully as admin", user: user })).to.be.true;
            //expect(res.cookie.calledWith("uid", "mockToken")).to.be.true;
        });

    });

    // Test for postNewPassword function
    describe("postNewPassword", () => {
        it("should return error if email or OTP is missing", async () => {
            const req = { body: { email: '', OTP: '', password: 'newPassword', rpassword: 'newPassword' } };
            const res = { json: sinon.spy() };
    
            await postNewPassword(req, res);
            expect(res.json.calledWith({ success: false, message: "Empty OTP details" })).to.be.true;
        });
        
        it("should return error if no OTP found", async () => {
            const expiredOTP = {}; // Expired OTP
            sinon.stub(OTPverification, 'find').resolves([]);
            const req = { body: { email: 'test@example.com', OTP: '1234', password: 'newPassword', rpassword: 'newPassword' } };
            const res = { json: sinon.spy() };
            //sinon.stub(OTPverification, 'deleteMany').resolves();
    
            await postNewPassword(req, res);
            expect(res.json.calledWith({ success: false, message: "No OTP verification records found" })).to.be.true;
        });

        // Test case for expired OTP
        it("should return error if OTP has expired", async () => {
            const expiredOTP = { otp: 'hashedOTP', expireAt: Date.now() - 1000 }; // Expired OTP
            sinon.stub(OTPverification, 'find').resolves([expiredOTP]);
            const req = { body: { email: 'test@example.com', OTP: '1234', password: 'newPassword', rpassword: 'newPassword' } };
            const res = { json: sinon.spy() };
            sinon.stub(OTPverification, 'deleteMany').resolves();
    
            await postNewPassword(req, res);
            expect(res.json.calledWith({ success: false, message: "OTP has expired, please request again" })).to.be.true;
        });
    
        // Test case for passwords not matching
        it("should return error if passwords do not match", async () => {
            const otpRecord = { otp: 'hashedOTP', expireAt: Date.now() + 10000 }; // Valid OTP
            sinon.stub(OTPverification, 'find').resolves([otpRecord]);
            sinon.stub(bcrypt, 'compare').resolves(true); // Valid OTP comparison
            const req = { body: { email: 'test@example.com', OTP: '1234', password: 'newPassword', rpassword: 'differentPassword' } };
            const res = { json: sinon.spy() };
            sinon.stub(OTPverification, 'deleteMany').resolves();
    
            await postNewPassword(req, res);
            expect(res.json.calledWith({ success: false, message: "Passwords do not match" })).to.be.true;
        });

        it("should return error if invalid OTP", async () => {
            const otpRecord = { otp: 'hashedOTP', expireAt: Date.now() + 10000 }; // Valid OTP
            sinon.stub(OTPverification, 'find').resolves([otpRecord]);
            sinon.stub(bcrypt, 'compare').resolves(false); // Valid OTP comparison
            const req = { body: { email: 'test@example.com', OTP: '1234', password: 'newPassword', rpassword: 'differentPassword' } };
            const res = { json: sinon.spy() };
            sinon.stub(OTPverification, 'deleteMany').resolves();
    
            await postNewPassword(req, res);
            expect(res.json.calledWith({ success: false, message: "Invalid OTP, try again" })).to.be.true;
        });
    
        // Test case for user not found
        it("should return error if user is not found", async () => {
            const otpRecord = { otp: 'hashedOTP', expireAt: Date.now() + 10000 }; // Valid OTP
            sinon.stub(OTPverification, 'find').resolves([otpRecord]);
            sinon.stub(bcrypt, 'compare').resolves(true); // Valid OTP comparison
            sinon.stub(loginschema, 'findOne').resolves(null); // No user found
            const req = { body: { email: 'test@example.com', OTP: '1234', password: 'newPassword', rpassword: 'newPassword' } };
            const res = { json: sinon.spy() };
            sinon.stub(OTPverification, 'deleteMany').resolves();
    
            await postNewPassword(req, res);
            expect(res.json.calledWith({ success: false, message: "No such user found" })).to.be.true;
        });
    
        // Test case for successful password change
        it("should successfully update password and return success", async () => {
            const otpRecord = { otp: 'hashedOTP', expireAt: Date.now() + 100000,email: 'test@example.com'};
            const findStub = sinon.stub(OTPverification, 'find').resolves([otpRecord]);
            const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);
            const hashStub = sinon.stub(bcrypt, 'hash').resolves('newHashedPassword');
            const userMock = {_id: 'userId',email: 'test@example.com',password: 'oldPassword',save: sinon.stub().resolves()};
            const findOneStub = sinon.stub(loginschema, 'findOne').resolves(userMock);
            const deleteManyStub = sinon.stub(OTPverification, 'deleteMany').resolves();
            const req = { body: { email: 'test@example.com', OTP: '1234', password: 'newPassword', rpassword: 'newPassword' } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis()};

            await postNewPassword(req, res);

            expect(findStub.calledWith({ email: 'test@example.com' })).to.be.true;
            expect(compareStub.calledWith('1234', 'hashedOTP')).to.be.true;
            expect(hashStub.calledWith('newPassword', 10)).to.be.true;
            expect(findOneStub.calledWith({ email: 'test@example.com' })).to.be.true;
            expect(deleteManyStub.calledWith({ email: 'test@example.com' })).to.be.true;
            expect(userMock.save.called).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ success: true, message: "Password Changed Successfully", redirectTo: "/login"})).to.be.true;
        });


        it("should return error message if an exception is thrown", async () => {
            // Simulate an error in the OTPverification.find call
            sinon.stub(OTPverification, 'find').rejects(new Error("Database error"));
        
            const req = { body: { email: 'test@example.com', OTP: '1234', password: 'newPassword', rpassword: 'newPassword' } };
            const res = { json: sinon.spy() };
        
            await postNewPassword(req, res);
        
            // Check if res.json was called with the expected error message
            expect(res.json.calledWith({
                success: false,
                message: "Database error", // This should be the error message thrown in the try block
            })).to.be.true;
        
            sinon.restore(); // Restore the stubbed methods after the test
        });
    });
    

    // Test for postForgotPassword function
    describe("postForgotPassword", () => {
        it("should return error if user does not exist", async () => {
            sinon.stub(loginschema, 'findOne').resolves(null);
            const req = { body: { email: 'notfound@example.com' } };
            const res = { json: sinon.spy() };

            await postForgotPassword(req, res);
            expect(res.json.calledWith({ success: false, message: "User doesn't exists! Please register first" })).to.be.true;
        });

        it("should return error if database error", async () => {
            sinon.stub(loginschema, 'findOne').rejects(new Error("Database error"))
            const req = { body: { email: 'notfound@example.com' } };
            const res = { json: sinon.spy() };

            await postForgotPassword(req, res);
            expect(res.json.calledWith({ success: false, message: "Database error" })).to.be.true;
        });

        it("should send OTP if user exists", async () => {
            sinon.stub(loginschema, 'findOne').resolves({ _id: 'userId' });
            sinon.stub(OTPverification, 'deleteMany').resolves();
            sinon.stub(OTPControllers, 'sendGmailOTP').resolves();
            const req = { body: { email: 'test@example.com' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            await postForgotPassword(req, res);
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ success: true, message: "Enter new password", redirectTo: "/newpassword" })).to.be.true;
        });
    });

    // Test for logout function
    describe("logout", () => {
        it("should clear the cookie and log out the user", async () => {
            const res = { clearCookie: sinon.spy(), json: sinon.spy() };

            await logout({}, res);
            expect(res.clearCookie.calledWith("uid")).to.be.true;
            expect(res.json.calledWith({ success: true, message: "Logged Out successfully" })).to.be.true;
        });

        it("should handle logout error", async () => {
            const res = { json: sinon.spy() };

            await logout({}, res);
            
            expect(res.json.calledWith({ success: false, message: "logout error" })).to.be.true;
        });
    });

    // Test for postPassword function
    describe("postPassword", () => {
        it("should return error if passwords do not match", async () => {
            const req = { user: { email: 'test@example.com' }, body: { password: 'newPassword', rpassword: 'differentPassword' } };
            const res = { json: sinon.spy() };

            await postPassword(req, res);
            expect(res.json.calledWith({ success: false, message: "Password doesn't match" })).to.be.true;
        });

        it("should update password if user exists", async () => {
            const user = { save: sinon.spy() };
            sinon.stub(loginschema, 'findOne').resolves(user);
            sinon.stub(bcrypt, 'hash').resolves("hashedPassword");
            const req = { user: { email: 'test@example.com' }, body: { username: 'testUser', password: 'newPassword', rpassword: 'newPassword' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            await postPassword(req, res);
            expect(user.save.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ success: true, message: "User registered", redirectTo: "/happytails/user/main" })).to.be.true;
        });

        it("should handle error in postpassword", async () => {
            sinon.stub(loginschema, 'findOne').resolves(null);
            const req = { user: { }, body: { username: 'testUser', password: 'newPassword', rpassword: 'newPassword' } };
            const res = { json: sinon.spy() };
            await postPassword(req, res);
            expect(res.json.calledWith({ success: false, message: "User doesn't exists! Please register first"})).to.be.true;
        });
    });
});


