// models/powerModel.js
const mongoose = require('../config/db'); // Import mongoose from the config file

const powerSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId, // Add userId field
  timestamp: Date,
  consumedPower: Number,
});

const Power = mongoose.model('Power', powerSchema);

module.exports = Power;
