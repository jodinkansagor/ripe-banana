require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });


  afterAll(() => {
    return mongoose.connection.close();
  });

  it('adds and actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: 'Maya Rudolph',
        dob: 'July 27, 1972',
        pob: 'Florida'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Maya Rudolph',
          dob: '1972-07-27T07:00:00.000Z',
          pob: 'Florida',
          __v: 0
        });
      });
  });





});
