const Review = require('./Review');

describe('Review model', () => {

  it('has a required rating', () => {
    const review = new Review();
    const { errors } = review.validateSync();

    expect(errors.rating.message).toEqual('Path `rating` is required.');
  });

  it('has a required reviewer', () => {
    const review = new Review();
    const { errors } = review.validateSync();

    expect(errors.reviewer.message).toEqual('Path `reviewer` is required.');
  });

  it('has a required rating', () => {
    const review = new Review();
    const { errors } = review.validateSync();

    expect(errors.film.message).toEqual('Path `film` is required.');
  });
});

