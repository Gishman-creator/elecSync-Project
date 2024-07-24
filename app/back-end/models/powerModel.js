const mongoose = require('../config/db'); // Import mongoose from the config file

const powerSchema = new mongoose.Schema({
  timestamp: Date,
  consumedPower: Number,
});

const Power = mongoose.model('Power', powerSchema);

module.exports = Power;
