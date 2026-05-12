const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    default: 50,
  },
  type: {
    type: String,
    enum: ['AC', 'Non-AC', 'Sleeper', 'Seater'],
    default: 'Non-AC',
  },
  driverName: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Inactive'],
    default: 'Active',
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
  }
}, {
  timestamps: true,
});

const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;
