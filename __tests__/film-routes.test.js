require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio;
  let actor;
  let review;
  let film;
  let reviewer;
  beforeEach(async () => {
    studio = await Studio.create({
      name: 'Warner Brothers',
      address: {
        city: 'LA',
        state: 'CA',
        country: 'US'
      }
    });

    reviewer = await Reviewer.create({
      name: 'JBJ',
      company: 'JBJ Loves Movies'
    });

    actor = await Actor.create({
      name: 'Jason Patrick',
      dob: 'June 17, 1966',
      pob: 'Queens, NY'
    });

    film = await Film.create({
      title: 'The Lost Boys',
      studio: studio._id,
      released: 1987,
      cast: [{
        role: 'Michael',
        actor: actor.id
      }]
    });

    review = await Review
      .create({
        rating: 4,
        review: 'rad!',
        reviewer: reviewer._id,
        film: film._id
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
          id: expect.any(String),
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
    console.log(films);
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        films.forEach(film => {
          expect(res.body).toContainEqual({
            id: film.id,
            _id: film._id.toString(),
            title: film.title,
            studio: {
              id: studio.id,
              _id: studio._id.toString(),
              name: studio.name
            },
            released: film.released
          });
        });
      });
  });


  it('gets a film by id', async () => {


    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        console.log(res.body)
        expect(res.body).toEqual({
          _id: film._id.toString(),
          title: film.title,
          id: film.id,
          released: film.released,
          reviews: [{
            film: expect.any(String),
            _id: review._id.toString(),
            rating: review.rating,
            review: review.review,
            reviewer: {
              id: reviewer.id,
              _id: reviewer._id.toString(),
              name: reviewer.name
            }
          }],
          studio: {
            id: studio.id,
            _id: studio._id.toString(),
            name: studio.name
          },
          cast: [{
            _id: expect.any(String),
            role: film.cast[0].role,
            actor: {
              id: expect.any(String),
              name: actor.name,
              _id: film.cast[0].actor._id.toString()
            }
          }],
          __v: 0
        });
      });
  });
});

