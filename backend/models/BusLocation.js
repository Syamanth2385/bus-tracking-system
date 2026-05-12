const mongoose = require('mongoose');

const busLocationSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  speed: {
    type: Number, // km/h (simulated based on traffic)
    default: 0
  },
  trafficCondition: {
    type: String,
    enum: ['Clear', 'Moderate', 'Heavy'],
    default: 'Clear'
  },
  nextStop: {
    stopName: String,
    eta: Number // in minutes
  },
  availableSeats: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true,
});

const BusLocation = mongoose.model('BusLocation', busLocationSchema);
module.exports = BusLocation;
