const mongoose = require('mongoose');
const Actor = require('./Actor');

describe('Actor model', () => {

  it('has a required name field', () => {
    const actor = new Actor();
    const { errors } = actor.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');


  });

});


