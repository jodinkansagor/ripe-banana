const chance = require('chance').Chance();

const Actor = require('../models/Actor');
const Film = require('../models/Film');
const Review = require('../models/Review');
const Reviewer = require('../models/Reviewer');
const Studio = require('../models/Studio');


module.exports = async ({ actor = 50, film = 100, studio = 15, review = 10, reviewer = 50 } = {}) => {
  const actors = await Actor.create([...Array(actor)].map(() => ({
    name: chance.name(),
    dob: new Date(),
    pob: chance.city()
  })));

  const studios = await Studio.create([...Array(studio)].map(() => ({
    name: chance.company(),
    address: {
      city: chance.city(),
      state: chance.state(),
      country: chance.country()
    }
  })));

  const films = await Film.create([...Array(film)].map(() => ({
    title: chance.animal(),
    studio: chance.pickone(studios.map(studio => studio._id)),
    released: chance.year(),
    cast: [{
      role: chance.name(),
      actor: chance.pickone(actors.map(actor => actor._id))
    }]
  })));


  const reviewers = await Reviewer.create([...Array(reviewer)].map(() => ({
    name: chance.name(),
    company: chance.company()
  })));

  await Review.create([...Array(review)].map(() => ({
    rating: chance.integer({ min: 1, max: 5 }),
    review: chance.string({ length: 10 }),
    reviewer: chance.pickone(reviewers.map(reviewer => reviewer._id)),
    film: chance.pickone(films.map(film => film._id))
  })));
};
