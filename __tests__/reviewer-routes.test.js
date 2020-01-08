const { getActor, getActors, getFilm, getFilms, getReview, getReviews, getStudio, getStudios, getReviewer, getReviewers } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer');


describe('app routes', () => {

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
    const reviewers = await getReviewers();

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

  it('can get a reviewer by id', async () => {
    const reviewer = await getReviewer();
    const reviews = await getReviews({ reviewer: reviewer._id });



    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        reviews.forEach(review => {
          expect(res.body.reviews).toContainEqual({
            _id: review._id.toString(),
            rating: review.rating,
            review: review.review,
            film: {
              _id: expect.any(String),
              title: expect.any(String)
            }
          });
        });

        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: reviewer.name,
          company: reviewer.company,
          __v: 0,
          id: reviewer.id,
          reviews: expect.any(Array)
        });
      });
  });



  it('can update a reviewer', async () => {
    const reviewer = await getReviewer();

    return request(app)
      .patch(`/api/v1/reviewers/${reviewer._id}`)
      .send({ company: 'JBJ Really Loves Movies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: reviewer.name,
          company: 'JBJ Really Loves Movies',
          __v: 0,
          id: reviewer.id
        });
      });
  });

  it('can delete a reviewer by id', async () => {
    const reviewer = await Reviewer.create({
      name: 'JBJ',
      company: 'JBJ loves movies'
    });


    return request(app)
      .delete(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'JBJ',
          company: 'JBJ loves movies',
          __v: 0,
          id: expect.any(String)
        });
      });
  });
});

