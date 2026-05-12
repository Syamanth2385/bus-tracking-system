const Bus = require('../models/Bus');
const Route = require('../models/Route');
const BusLocation = require('../models/BusLocation');

// @desc    Get all routes
// @route   GET /api/buses/routes
// @access  Public
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({});
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique locations from routes
// @route   GET /api/buses/routes/locations
// @access  Public
const getLocations = async (req, res) => {
  try {
    const routes = await Route.find({});
    const locations = new Set();
    routes.forEach(route => {
      route.stops.forEach(stop => locations.add(stop.stopName));
    });
    res.json(Array.from(locations).sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find({}).populate('route', 'routeName origin destination stops');
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single bus by ID
// @route   GET /api/buses/:id
// @access  Public
const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('route', 'routeName origin destination');
    if (bus) {
      res.json(bus);
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a bus
// @route   POST /api/buses
// @access  Private/Admin
const createBus = async (req, res) => {
  try {
    const { busNumber, capacity, type, driverName, status, routeId } = req.body;

    const busExists = await Bus.findOne({ busNumber });
    if (busExists) {
      return res.status(400).json({ message: 'Bus already exists' });
    }

    const bus = new Bus({
      busNumber,
      capacity,
      type,
      driverName,
      status,
      route: routeId
    });

    const createdBus = await bus.save();

    // Initialize BusLocation to make it appear on the map immediately
    if (routeId) {
      const route = await Route.findById(routeId);
      if (route && route.pathCoordinates && route.pathCoordinates.length > 0) {
        await BusLocation.create({
          bus: createdBus._id,
          route: routeId,
          currentLocation: route.pathCoordinates[0],
          speed: Math.floor(Math.random() * 20) + 40,
          trafficCondition: 'Clear'
        });
      }
    }

    res.status(201).json(createdBus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a bus
// @route   PUT /api/buses/:id
// @access  Private/Admin
const updateBus = async (req, res) => {
  try {
    const { busNumber, capacity, type, driverName, status, routeId } = req.body;

    const bus = await Bus.findById(req.params.id);

    if (bus) {
      bus.busNumber = busNumber || bus.busNumber;
      bus.capacity = capacity || bus.capacity;
      bus.type = type || bus.type;
      bus.driverName = driverName || bus.driverName;
      bus.status = status || bus.status;
      if (routeId) bus.route = routeId;

      const updatedBus = await bus.save();
      res.json(updatedBus);
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (bus) {
      await bus.deleteOne();
      await BusLocation.deleteMany({ bus: bus._id });
      res.json({ message: 'Bus removed' });
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRoutes,
  getLocations,
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus
};
