require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let reviewer;
  beforeEach(async () => {
    reviewer = await Reviewer
      .create({
        name: 'JBJ',
        company: 'JBJ Loves Movies'
      });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('adds a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({
        name: 'JBJ',
        company: 'JBJ Loves Movies'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'JBJ',
          company: 'JBJ Loves Movies',
          __v: 0
        });
      });
  });

  it('gets all reviewers', async () => {
    const reviewers = await Reviewer.create([
      { name: 'JBJ', company: 'JBJ Loves Movies' },
      { name: 'Dandy', company: 'Will Probably Forget Every Movie' },
      { name: 'Rosey', company: 'Dogs Like Movies Too' }
    ]);

    return request(app)
      .get('/api/v1/reviewers')
      .then(res =>
        reviewers.forEach(reviewer => {
          expect(res.body).toContainEqual({
            _id: reviewer._id.toString(),
            name: reviewer.name,
            company: reviewer.company,
            __v: 0
          });
        }));
  });

  it('can get a reviewer by id', () => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: 'JBJ',
          company: 'JBJ Loves Movies',
          __v: 0
        });
      });
  });

  it('can update a reviewer', () => {
    return request(app)
      .patch(`/api/v1/reviewers/${reviewer._id}`)
      .send({ company: 'JBJ Really Loves Movies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: 'JBJ',
          company: 'JBJ Really Loves Movies',
          __v: 0
        });
      });
  });

});
