const mongoose = require('mongoose');

const FlightsSchema = mongoose.Schema({
  TIME: String,
  data: [{
    Month: String,
    value: Number
  }]
});

const FlightsData = mongoose.model('FlightsData', FlightsSchema);

module.exports = {FlightsData};