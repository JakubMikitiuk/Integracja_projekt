const mongoose = require('mongoose');

const GdpDataSchema = mongoose.Schema({
  TIME: String,
  data: [{
    quarter: String,
    value: Number
  }]
});

const GdpData = mongoose.model('GdpData', GdpDataSchema);

module.exports = {GdpData};