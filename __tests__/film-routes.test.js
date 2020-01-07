require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio;
  let actor;
  let lostBoys;
  beforeEach(async () => {
    studio = await Studio.create({
      name: 'Warner Brothers',
      address: {
        city: 'LA',
        state: 'CA',
        country: 'US'
      }
    });

    actor = await Actor.create({
      name: 'Jason Patrick',
      dob: 'June 17, 1966',
      pob: 'Queens, NY'
    });

  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('posts a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({
        title: 'The Lost Boys',
        studio: studio._id,
        released: 1987,
        cast: [
          {
            role: 'Michael',
            actor: actor._id
          }
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'The Lost Boys',
          studio: studio._id.toString(),
          released: 1987,
          cast: [
            {
              _id: expect.any(String),
              role: 'Michael',
              actor: actor._id.toString()
            }
          ],
          __v: 0
        });
      });
  });

  it('gets all films', async () => {

    const films = await Film.create([
      {
        title: 'The Lost Boys',
        studio: studio._id,
        released: 1987,
        cast: [
          {
            role: 'Michael',
            actor: actor._id
          }
        ],
      }
    ]);

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        films.forEach(film => {
          expect(res.body).toEqual([{
            _id: film._id.toString(),
            title: film.title,
            studio: {
              _id: studio._id.toString(),
              name: studio.name
            },
            released: film.released
          }]);
        });
      });
  });


  it('gets a film by id', async () => {

    const lostBoys = await Film.create({
      title: 'The Lost Boys',
      studio: studio._id,
      released: 1987,
      cast: [
        {
          role: 'Michael',
          actor: actor._id
        }
      ]
    });

    return request(app)
      .get(`/api/v1/films/${lostBoys._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: lostBoys._id.toString(),
          title: lostBoys.title,
          released: lostBoys.released,
          studio: {
            _id: studio._id.toString(),
            name: studio.name
          },
          cast: [{
            _id: expect.any(String),
            role: lostBoys.cast[0].role,
            actor: {
              name: actor.name,
              _id: lostBoys.cast[0].actor._id.toString()
            }
          }],
          __v: 0
        });
      });
  });
});

