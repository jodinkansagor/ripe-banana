const { getActor, getActors, getFilm, getFilms, getReview, getReviews, getStudio, getStudios, getReviewer, getReviewers } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('app routes', () => {


  it('adds a review', async () => {
    const reviewer = await getReviewer();
    const film = await getFilm();

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

  it('returns top 100 reviews', async () => {
    const reviews = await getReviews();

    return request(app)
      .get('/api/v1/reviews')
      .then(res =>
        reviews.forEach(review => {
          expect(res.body).toContainEqual({
            _id: review.id,
            rating: review.rating,
            review: review.review,
            reviewer: expect.any(String),
            film: {
              title: expect.any(String),
              _id: expect.any(String)
            },
            __v: 0
          });
        })
      );
  });

  it('deletes a review by id', async () => {

    const review = await getReview();


    return request(app)
      .delete(`/api/v1/reviews/${review._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: review._id.toString(),
          rating: review.rating,
          review: review.review,
          reviewer: expect.any(String),
          film: expect.any(String),
          __v: 0
        });
      });
  });
});


