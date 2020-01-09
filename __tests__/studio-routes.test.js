const { getFilms, getStudio, getStudios } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');


describe('app routes', () => {


  it('adds a studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({
        name: 'Paramount',
        address: {
          city: 'LA',
          state: 'CA',
          country: 'US'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paramount',
          address: {
            city: 'LA',
            state: 'CA',
            country: 'US'
          },
          __v: 0

        });
      });
  });

  it('gets all studios', async () => {
    const studios = await getStudios();

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        studios.forEach(studio => {
          expect(res.body).toContainEqual({
            _id: studio._id.toString(),
            name: studio.name
          });

        });
      });

  });

  it('gets a studio by id', async () => {
    const studio = await getStudio();
    const films = await getFilms({ films: studio._id });

    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        films.forEach(film => {
          expect(res.body.films).toContainEqual({ _id: film.id });
        });

        expect(res.body).toEqual({
          _id: studio._id.toString(),
          name: studio.name,
          address: {
            city: studio.address.city,
            state: studio.address.state,
            country: studio.address.country,
          },
          films: expect.any(Array),
          __v: 0
        });
      });
  });
});
