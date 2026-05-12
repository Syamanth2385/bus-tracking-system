const express = require('express');
const router = express.Router();
const {
  getRoutes,
  getLocations,
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus
} = require('../controllers/busController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/routes/locations').get(getLocations);
router.route('/routes').get(getRoutes);

router.route('/')
  .get(getBuses)
  .post(protect, admin, createBus);

router.route('/:id')
  .get(getBusById)
  .put(protect, admin, updateBus)
  .delete(protect, admin, deleteBus);

module.exports = router;
