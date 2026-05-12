const express = require('express');
const router = express.Router();
const {
  getLiveLocations,
  searchBuses,
  getBusLocation,
  updateBusLocation
} = require('../controllers/trackingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getLiveLocations);

router.route('/search').get(searchBuses);

router.route('/:busId')
  .get(getBusLocation)
  .put(protect, admin, updateBusLocation);

module.exports = router;
