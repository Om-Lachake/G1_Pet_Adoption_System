const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const formschema = require('../models/formschema');
const { submitForm, getForm, updateStatus, getFormMiddleware } = require('../controllers/formControllers');

describe('Form Controller Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            query: {},
            user: {},
            params: {}
        };
        res = {
            json: sinon.spy(),
            status: sinon.stub().returns({ json: sinon.spy() })
        };
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('submitForm', () => {
        it('should return error if user email does not match form email', async () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                address: '123 Test St',
                firstpet: 'No',
                whyadopt: 'Love pets',
                petid: '123'
            };
            req.user = { email: 'different@example.com' };

            await submitForm(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: false,
                message: 'You can only apply using your registered email.'
            });
        });

        // New test to cover line 19
        it('should return error if required fields are missing', async () => {
            req.body = {
                email: 'test@example.com',
                // Missing other required fields
                petid: '123'
            };
            req.user = { email: 'test@example.com' };

            sinon.stub(formschema, 'findOne').resolves(null);

            await submitForm(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: false,
                message: 'all fields required'
            });
        });

        it('should return error if form already exists for the pet', async () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                address: '123 Test St',
                firstpet: 'No',
                whyadopt: 'Love pets',
                petid: '123'
            };
            req.user = { email: 'test@example.com' };

            sinon.stub(formschema, 'findOne').resolves({ 
                email: 'test@example.com',
                petid: '123'
            });

            await submitForm(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: false,
                message: 'you have already applied for this pet'
            });
        });

        it('should successfully submit a new form', async () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                address: '123 Test St',
                firstpet: 'No',
                whyadopt: 'Love pets',
                petid: '123'
            };
            req.user = { email: 'test@example.com' };

            sinon.stub(formschema, 'findOne').resolves(null);
            const saveStub = sinon.stub().resolves({});
            sinon.stub(formschema.prototype, 'save').callsFake(saveStub);

            await submitForm(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: true,
                message: 'form submitted succesfully'
            });
        });
    });

    describe('getForm', () => {
        // New test to cover line 34
        it('should filter forms by _id when provided', async () => {
            req.query = {
                _id: '123456789'
            };

            const mockForms = [{ id: '123456789', status: 'pending' }];
            sinon.stub(formschema, 'find').resolves(mockForms);

            await getForm(req, res);

            expect(formschema.find.calledWith({ _id: '123456789' })).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: true,
                message: 'Filtered forms retrieved',
                forms: mockForms
            });
        });

        it('should return filtered forms based on query parameters', async () => {
            req.query = {
                petid: '123',
                status: 'pending',
                email: 'test@example.com'
            };

            const mockForms = [
                { id: 1, status: 'pending' },
                { id: 2, status: 'pending' }
            ];

            sinon.stub(formschema, 'find').resolves(mockForms);

            await getForm(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: true,
                message: 'Filtered forms retrieved',
                forms: mockForms
            });
        });

        it('should handle errors during form retrieval', async () => {
            sinon.stub(formschema, 'find').rejects(new Error('Database error'));

            await getForm(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.status().json.calledOnce).to.be.true;
            expect(res.status().json.firstCall.args[0]).to.deep.equal({
                success: false,
                message: 'Database error'
            });
        });
    });

    describe('getFormMiddleware', () => {
        // New test to cover line 46
        it('should handle database errors', async () => {
            req.params.id = '123';
            
            sinon.stub(formschema, 'findById').rejects(new Error('Database connection error'));

            await getFormMiddleware(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.status().json.firstCall.args[0]).to.deep.equal({
                success: false,
                message: 'Database connection error'
            });
        });

        it('should set form in response and call next if form exists', async () => {
            req.params.id = '123';
            const mockForm = { id: '123', status: 'pending' };
            
            sinon.stub(formschema, 'findById').resolves(mockForm);

            await getFormMiddleware(req, res, next);

            expect(res.form).to.deep.equal(mockForm);
            expect(next.calledOnce).to.be.true;
        });

        it('should return 400 if form not found', async () => {
            req.params.id = '123';
            
            sinon.stub(formschema, 'findById').resolves(null);

            await getFormMiddleware(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.status().json.firstCall.args[0]).to.deep.equal({
                success: false,
                message: 'cannot find form'
            });
        });
    });

    describe('updateStatus', () => {
        // New test to cover line 69
        it('should handle database errors during status update', async () => {
            req.body = { status: 'approved' };
            res.form = {
                status: 'pending',
                save: sinon.stub().rejects(new Error('Database error during save'))
            };

            await updateStatus(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.status().json.firstCall.args[0]).to.deep.equal({
                success: false,
                message: 'Database error during save'
            });
        });

        it('should update form status successfully', async () => {
            req.body = { status: 'approved' };
            res.form = {
                status: 'pending',
                save: sinon.stub().resolves({ status: 'approved' })
            };

            await updateStatus(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: true,
                message: 'Status updated',
                updatedForm: { status: 'approved' }
            });
        });

        it('should return error if status is missing', async () => {
            req.body = {};

            await updateStatus(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.status().json.firstCall.args[0]).to.deep.equal({
                success: false,
                message: 'Status is required'
            });
        });

        it('should return error if form not found', async () => {
            req.body = { status: 'approved' };
            res.form = null;

            await updateStatus(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.status().json.firstCall.args[0]).to.deep.equal({
                success: false,
                message: 'No form found'
            });
        });
    });
});


