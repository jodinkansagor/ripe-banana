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

  it('has a review with more than 1 character', () => {
    const review = new Review();
    const { errors } = review.validateSync();

    expect(errors.review.message).toEqual('Path `review` is required.');
  });

  it('has a review with less than 141 characters', () => {
    const review = new Review({
      review: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et mag'
    });
    const { errors } = review.validateSync();
    expect(errors.review.message).toEqual('Path `review` (`Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et mag`) is longer than the maximum allowed length (140).');
  });
});

