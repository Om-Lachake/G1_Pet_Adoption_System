const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const { bucket } = require('../service/firebaseConfig');
const Pet = require('../models/petDetails');
const {
  getAllPets,
  getOnePet,
  createPet,
  updatePet,
  deletePet,
  getPet
} = require('../controllers/APIControllers');

describe('Pet Controller Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      file: {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg'
      }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
      pet: null
    };
    next = sinon.spy();});
  afterEach(() => {
    sinon.restore();
  });

  describe('getAllPets', () => {
    it('should return all pets without filters', async () => {
      const mockPets = [
        { name: 'Max', type: 'Dog', gender: 'Male', age: 3 },
        { name: 'Luna', type: 'Cat', gender: 'Female', age: 2 }
      ];
      sinon.stub(Pet, 'find').resolves(mockPets);

      await getAllPets(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: "pets found",
        pets: mockPets
      })).to.be.true;
    });

    it('should filter pets by category', async () => {
      req.query.Category = 'Dog';
      const mockPets = [{ name: 'Max', type: 'Dog', gender: 'Male', age: 3 }];
      
      sinon.stub(Pet, 'find').resolves(mockPets);
      await getAllPets(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(Pet.find.calledWith({
        type: { $in: [sinon.match.instanceOf(RegExp)] }
      })).to.be.true;
    });

    it('should handle errors', async () => {
      sinon.stub(Pet, 'find').rejects(new Error('Database error'));

      await getAllPets(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        messahe: "error",
        error: 'Database error'
      })).to.be.true;
    });
  });
  describe('createPet', () => {
    it('should create a new pet with image', async () => {
      const mockPet = {
        name: 'Max',
        type: 'Dog',
        gender: 'Male',
        age: 3,
        description: 'Friendly dog'
      };
      req.body = mockPet;
      const mockBlob = {
        createWriteStream: sinon.stub().returns({
          on: sinon.stub().returnsThis(),
          end: sinon.spy()
        })
      };
      sinon.stub(bucket, 'file').returns(mockBlob);
      sinon.stub(Pet.prototype, 'save').resolves(mockPet);
       await createPet(req, res);

      expect(bucket.file.called).to.be.true;
      expect(mockBlob.createWriteStream.called).to.be.true;
    });
  });

  describe('updatePet', () => {
    beforeEach(() => {
      res.pet = {
        name: 'Max',
        type: 'Dog',
        gender: 'Male',
        age: 3,
        description: 'Friendly dog',
        save: sinon.stub().resolves()
      };
    });
    it('should update pet without new image', async () => {
      req.body = {
        name: 'Maxwell',
        age: 4
      };
      req.file = null;

      await updatePet(req, res);

      expect(res.pet.name).to.equal('Maxwell');
      expect(res.pet.age).to.equal(4);
      expect(res.pet.save.called).to.be.true;
    });

    it('should handle pet not found', async () => {
      res.pet = null;
      await updatePet(req, res);
      // expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Pet not found'
      })).to.be.true;
    });
  });

  describe('deletePet', () => {
    it('should delete an existing pet', async () => {
      res.pet = {
        deleteOne: sinon.stub().resolves()
      };

      await deletePet(req, res);

      expect(res.pet.deleteOne.called).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: "deleted pet detail"
      })).to.be.true;
    });

    it('should handle delete error', async () => {
      res.pet = {
        deleteOne: sinon.stub().rejects(new Error('Delete error'))
      };

      await deletePet(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        error: 'Delete error'
      })).to.be.true;
    });
  });

  describe('getPet', () => {
    it('should find pet by id and attach to response', async () => {
      const mockPet = { id: '123', name: 'Max' };
      req.params.id = '123';
      sinon.stub(Pet, 'findById').resolves(mockPet);

      await getPet(req, res, next);

      expect(res.pet).to.equal(mockPet);
      expect(next.called).to.be.true;
    });

    it('should handle pet not found', async () => {
      req.params.id = '123';
      sinon.stub(Pet, 'findById').resolves(null);

      await getPet(req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: "cannot find pet"
      })).to.be.true;
    });
  });
});






