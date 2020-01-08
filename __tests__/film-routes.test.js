const { getActor, getActors, getFilm, getFilms, getReview, getReviews, getStudio, getStudios, getReviewer, getReviewers } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('app routes', () => {


  it('posts a film', async () => {
    const studio = await getStudio();
    const actor = await getActor();

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
    const films = await getFilms();


    return request(app)
      .get('/api/v1/films')
      .then(res => {
        films.forEach(film => {
          expect(res.body).toContainEqual({
            _id: film._id.toString(),
            title: film.title,
            studio: {
              _id: expect.any(String),
              name: expect.any(String)
            },
            released: film.released
          });
        });
      });
  });


  it('gets a film by id', async () => {
    const film = await getFilm();
    const reviews = getReviews({ film: film._id });


    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {

        expect(res.body).toEqual({
          _id: film._id.toString(),
          title: film.title,
          released: film.released,
          reviews: expect.any(Array),
          studio: {
            _id: expect.any(String),
            name: expect.any(String)
          },
          cast: [{
            _id: expect.any(String),
            role: film.cast[0].role,
            actor: {
              name: expect.any(String),
              _id: expect.any(String)
            }
          }],
          __v: 0
        });
      });
  });
});

// {
//   _id: review._id.toString(),
//   rating: review.rating,
//   review: review.review,
//   reviewer: {
//     id: reviewer.id,
//     _id: reviewer._id.toString(),
//     name: reviewer.name
//   }
// }