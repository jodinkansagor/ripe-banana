require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let reviewer;
  let review;
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

    review = await Review
      .create({
        rating: 4,
        review: 'the best',
        reviewer: reviewer._id,
        film: film._id
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
          __v: 0,
          id: expect.any(String)
        });
      });
  });

  it('gets all reviewers', async () => {
    const reviewers = await Reviewer.create([
      { name: 'JBJ', company: 'JBJ Loves Movies' },
      { name: 'Dandy', company: 'Will Probably Forget Every Movie' },
      { name: 'Rosey', company: 'Dogs Like Movies Too' }
    ]);

    return request(app)
      .get('/api/v1/reviewers')
      .then(res =>
        reviewers.forEach(reviewer => {
          expect(res.body).toContainEqual({
            _id: reviewer._id.toString(),
            name: reviewer.name,
            company: reviewer.company,
            __v: 0,
            id: reviewer.id
          });
        }));
  });

  it('can get a reviewer by id', () => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        console.log(res.body)
        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: 'JBJ',
          company: 'JBJ Loves Movies',
          __v: 0,
          id: reviewer.id,
          reviews: [{

            _id: review._id.toString(),
            rating: review.rating,
            review: review.review,
            reviewer: reviewer._id.toString(),
            film: {
              id: film.id,
              _id: film._id.toString(),
              title: film.title
            }
          }]
        });
      });
  });

  it('can update a reviewer', () => {
    return request(app)
      .patch(`/api/v1/reviewers/${reviewer._id}`)
      .send({ company: 'JBJ Really Loves Movies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: 'JBJ',
          company: 'JBJ Really Loves Movies',
          __v: 0,
          id: reviewer.id
        });
      });
  });

  it('can delete a reviewer by id', () => {
    return request(app)
      .delete(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: 'JBJ',
          company: 'JBJ Loves Movies',
          __v: 0,
          id: reviewer.id
        });
      });
  });

  // it('wont delete a reviewer if they have reviews', () => {
  //   new Review({
  //     rating: 4,
  //     review: 'great!',
  //     reviewer: reviewer._id,
  //     film: film._id
  //   });
  //   console.log(reviewer)
  //   return request(app)
  //     .delete(`/api/v1/reviewers/${reviewer._id}`)
  //     .then(res =>
  //       expect(res.body).toEqual({

  //       })
  //     );
  // });
});
