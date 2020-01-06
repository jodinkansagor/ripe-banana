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

  it('adds a studio', () => {
    return request(app)
      .post('/api/v1/studio')
      .send({
        name: 'Paramount',
        address: {
          city: 'LA',
          state: 'CA',
          country: 'US'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paramount',
          address: {
            city: 'LA',
            state: 'CA',
            country: 'US'
          },
          __v: 0

        });
      });
  });
});
