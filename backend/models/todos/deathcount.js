const mongoose = require('mongoose');

const DeathCountSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
  },
  year2016: Number,
  year2017: Number,
  year2018: Number,
  year2019: Number,
  year2020: Number,
  year2021: Number,
  year2022: Number,
  year2023: Number,
});

const DeathCount = mongoose.model('DeathCount', DeathCountSchema);

module.exports = { DeathCount };