const BusLocation = require('../models/BusLocation');

// @desc    Get all live bus locations
// @route   GET /api/tracking
// @access  Public
const getLiveLocations = async (req, res) => {
  try {
    const locations = await BusLocation.find({})
      .populate({
        path: 'bus',
        select: 'busNumber capacity type'
      })
      .populate({
        path: 'route',
        select: 'routeName origin destination pathCoordinates stops'
      });
      
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search buses by source and destination
// @route   GET /api/tracking/search
// @access  Public
const searchBuses = async (req, res) => {
  try {
    const { source, destination } = req.query;
    
    // First, find all routes that have both source and destination
    // Here we can just check if the stops array contains them (in case insensitive way)
    // To keep it simple, we can find routes where stops.stopName matches source and destination
    const Route = require('../models/Route');
    const routes = await Route.find({});
    
    // Filter routes manually for simplicity to handle case-insensitivity
    const matchingRouteIds = routes.filter(route => {
      if (!source && !destination) return true;
      
      const stopNames = route.stops.map(s => s.stopName.toLowerCase());
      const hasSource = !source || stopNames.includes(source.toLowerCase());
      const hasDest = !destination || stopNames.includes(destination.toLowerCase());
      
      return hasSource && hasDest;
    }).map(r => r._id);

    const locations = await BusLocation.find({ route: { $in: matchingRouteIds } })
      .populate({
        path: 'bus',
        select: 'busNumber capacity type status'
      })
      .populate({
        path: 'route',
        select: 'routeName origin destination pathCoordinates stops'
      });
      
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get live location of a specific bus
// @route   GET /api/tracking/:busId
// @access  Public
const getBusLocation = async (req, res) => {
  try {
    const location = await BusLocation.findOne({ bus: req.params.busId })
      .populate('bus', 'busNumber capacity type')
      .populate('route', 'routeName origin destination');

    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ message: 'Live location not found for this bus' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bus location (Simulated by script or device)
// @route   PUT /api/tracking/:busId
// @access  Private/Admin
const updateBusLocation = async (req, res) => {
  try {
    const { currentLocation, speed, trafficCondition, nextStop, availableSeats } = req.body;

    const location = await BusLocation.findOne({ bus: req.params.busId });

    if (location) {
      location.currentLocation = currentLocation || location.currentLocation;
      location.speed = speed !== undefined ? speed : location.speed;
      location.trafficCondition = trafficCondition || location.trafficCondition;
      location.nextStop = nextStop || location.nextStop;
      location.availableSeats = availableSeats !== undefined ? availableSeats : location.availableSeats;

      const updatedLocation = await location.save();
      res.json(updatedLocation);
    } else {
      res.status(404).json({ message: 'Live location not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLiveLocations,
  searchBuses,
  getBusLocation,
  updateBusLocation
};
