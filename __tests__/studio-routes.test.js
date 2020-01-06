require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio;
  beforeEach(async () => {
    studio = await Studio
      .create({
        name: 'Warner Brothers',
        address: {
          city: 'LA',
          state: 'CA',
          country: 'US'
        }
      });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('adds a studios', () => {
    return request(app)
      .post('/api/v1/studios')
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

  it('gets all studios', async () => {
    const studios = await Studio.create([
      { name: 'Paramount' },
      { name: 'Columbia Pictures' },
      { name: 'Warner Brothers' }
    ]);

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        studios.forEach(studio => {
          expect(res.body).toContainEqual({
            _id: studio._id.toString(),
            name: studio.name
          });

        });
      });

  });

  it('gets a studio by id', () => {
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: studio._id.toString(),
          name: 'Warner Brothers',
          address: {
            city: 'LA',
            state: 'CA',
            country: 'US',
          },
          __v: 0
        });
      });
  });
});
