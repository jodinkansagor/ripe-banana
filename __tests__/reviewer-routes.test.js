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


});
