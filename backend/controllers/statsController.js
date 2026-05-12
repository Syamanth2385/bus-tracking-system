const Bus = require('../models/Bus');
const Route = require('../models/Route');
const User = require('../models/User');

const getStats = async (req, res) => {
  try {
    const totalBuses = await Bus.countDocuments({});
    const activeBuses = await Bus.countDocuments({ status: 'Active' });
    const totalRoutes = await Route.countDocuments({});
    const totalUsers = await User.countDocuments({});

    res.json({
      totalBuses,
      activeBuses,
      totalRoutes,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
