const Film = require('./Film');

describe('Film model', () => {
  it('has a required title', () => {
    const film = new Film();
    const { errors } = film.validateSync();

    expect(errors.title.message).toEqual('Path `title` is required.');
  });

  it('has a required studio', () => {
    const film = new Film();
    const { errors } = film.validateSync();

    expect(errors.studioId.message).toEqual('Path `studioId` is required.');
  });

  it('has a required release year', () => {
    const film = new Film();
    const { errors } = film.validateSync();

    expect(errors.released.message).toEqual('Path `released` is required.');
  });

  it('has a required actor', () => {
    const film = new Film({ cast: [{}] });
    const { errors } = film.validateSync();
    
    expect(errors['cast.0.actor'].message).toEqual('Path `actor` is required.');
  });
});
