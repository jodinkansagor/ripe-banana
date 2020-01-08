const Reviewer = require('./Reviewer');

describe('Reviwer model', () => {

  it('has a required name field', () => {
    const reviewer = new Reviewer();
    const { errors } = reviewer.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('has a required company field', () => {
    const reviewer = new Reviewer();
    const { errors } = reviewer.validateSync();

    expect(errors.company.message).toEqual('Path `company` is required.');
  });

});
