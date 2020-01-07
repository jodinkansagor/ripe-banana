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

    // lostBoys = await Film.create({
    //   title: 'The Lost Boys',
    //   studioId: studio._id,
    //   released: 1987,
    //   cast: [
    //     {
    //       role: 'Michael',
    //       actor: actor._id
    //     }
    //   ]
    // });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('posts a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({
        title: 'The Lost Boys',
        studioId: studio._id,
        released: 1987,
        cast: [
          {
            role: 'Michael',
            actor: actor._id
          }
        ]
      });
  });

  it('gets all films', async () => {

    const films = await Film.create([
      {
        title: 'The Lost Boys',
        studioId: studio._id,
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
            studioId: studio._id.toString(),
            released: film.released,
            __v: 0
          }]);
        });
      });
  });

});

