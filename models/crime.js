const mongoose = require('mongoose');

const CrimeSchema = new mongoose.Schema({
  date: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    default: ''
  },
  location: {
  	type: String,
  	default: ''
  },
  type: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  lat: Number,
  lon: Number,
  gotLocation: Boolean
});

module.exports = mongoose.model('Crime', CrimeSchema);
