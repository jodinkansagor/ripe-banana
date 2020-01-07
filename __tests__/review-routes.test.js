require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  let reviewer;
  let film;
  beforeEach(async () => {
    reviewer = await Reviewer
      .create({
        name: 'JBJ',
        company: 'JBJ Loves Movies'
      });

    const studio = await Studio
      .create({
        name: 'Warner Brothers',
        address: {
          city: 'LA',
          state: 'CA',
          country: 'US'
        }
      });

    film = await Film
      .create({
        title: 'The Lost Boys',
        studio: studio._id,
        released: 1987
      });
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('adds a review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 4,
        review: 'Cool movie',
        reviewer: reviewer._id,
        film: film._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 4,
          review: 'Cool movie',
          reviewer: reviewer._id.toString(),
          film: film._id.toString(),
          __v: 0
        });
      });
  });

});
