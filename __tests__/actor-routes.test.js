require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let actor;
  beforeEach(async () => {
    actor = await Actor
      .create({
        name: 'Jason Patrick',
        dob: '1966-06-17T00:00:00.000Z',
        pob: 'Queens, NY'
      });
  });


  afterAll(() => {
    return mongoose.connection.close();
  });

  it('adds and actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: 'Jason Patrick',
        dob: '1966-06-17T00:00:00.000Z',
        pob: 'Queens, NY'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Jason Patrick',
          dob: '1966-06-17T00:00:00.000Z',
          pob: 'Queens, NY',
          __v: 0
        });
      });
  });

  it('gets all actors', async () => {
    const actors = await Actor.create([
      { name: 'Corey Haim' },
      { name: 'Corey Feldman' }
    ]);

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        actors.forEach(actor => {
          expect(res.body).toContainEqual({
            _id: actor._id.toString(),
            name: actor.name
          });
        });
      });
  });

  it('gets one actor by id', () => {
    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'Jason Patrick',
          dob: '1966-06-17T00:00:00.000Z',
          pob: 'Queens, NY',
          films: [],
          __v: 0
        });
      });
  });

});
