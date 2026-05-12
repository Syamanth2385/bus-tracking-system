const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  stops: [{
    stopName: String,
    location: {
      lat: Number,
      lng: Number
    },
    estimatedTimeFromOrigin: Number // in minutes
  }],
  pathCoordinates: [{
    lat: Number,
    lng: Number
  }]
}, {
  timestamps: true,
});

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
