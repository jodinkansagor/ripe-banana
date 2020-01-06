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
  beforeEach(async() => {
    actor = await Actor
      .create({
        name: 'Maya Rudolph',
        dob: 'July 27, 1972',
        pob: 'Florida'
      });
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

  it('gets all actors', async() => {
    const actors = await Actor.create([
      { name: 'Maya Rudolph' },
      { name: 'Tina Fey' },
      { name: 'Amy Poehler' }
    ]);

    return request(app)
      .get('/api/v1/actors')
      .then(res =>
        actors.forEach(actor => {
          expect(res.body).toContainEqual({
            _id: actor._id.toString(),
            name: actor.name
          });
        }));
  });

  it('gets one actor by id', () => {
    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: actor._id.toString(),
          name: 'Maya Rudolph',
          dob: '1972-07-27T07:00:00.000Z',
          pob: 'Florida',
          __v: 0
        });
      });
  });

});
