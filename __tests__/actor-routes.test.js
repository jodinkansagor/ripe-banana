const { getActor, getActors, getFilms } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');


describe('app routes', () => {


  it('adds and actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: 'Jason Patrick',
        dob: '1966-06-17T00:00:00.000Z',
        pob: 'Queens, NY'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Jason Patrick',
          dob: '1966-06-17T00:00:00.000Z',
          pob: 'Queens, NY',
          __v: 0
        });
      });
  });

  it('gets all actors', async () => {
    const actors = await getActors();


    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        actors.forEach(actor => {
          expect(res.body).toContainEqual({
            _id: actor._id.toString(),
            name: actor.name
          });
        });
      });
  });

  it('gets one actor by id', async () => {
    const actor = await getActor();
    const films = await getFilms({ 'cast.actor': actor._id });

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        films.forEach(film => {
          expect(res.body.films).toContainEqual({ _id: film.id, cast: [{ actor: actor.id }], released: film.released, title: film.title });
        });
        expect(res.body).toEqual({
          _id: actor.id,
          name: actor.name,
          dob: actor.dob.toISOString(),
          pob: actor.pob,
          films: expect.any(Array),
          __v: 0
        });
      });
  });

});
