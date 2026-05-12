const BusLocation = require('./models/BusLocation');

const busState = {}; // Store progress locally

const runSimulation = async () => {
  setInterval(async () => {
    try {
      const locations = await BusLocation.find({}).populate('route');
      for (let loc of locations) {
        if (!loc.route || !loc.route.pathCoordinates || loc.route.pathCoordinates.length < 2) continue;
        
        let path = loc.route.pathCoordinates;
        if (!busState[loc._id]) {
          busState[loc._id] = { progress: 0, pathIndex: 0 };
        }
        
        let { progress, pathIndex } = busState[loc._id];
        
        // Adjust speed calculation for a realistic simulation step (every 5 seconds)
        // Increased speed for testing / better visual feedback
        const stepMultiplier = path.length / 50; 
        progress += ((loc.speed || 40) / 60000) * 60 * stepMultiplier;
        
        if (progress >= 1) {
          progress = 0;
          pathIndex++;
        }
        
        if (pathIndex >= path.length - 1) {
          pathIndex = 0;
        }
        
        busState[loc._id] = { progress, pathIndex };
        
        const startNode = path[pathIndex];
        const endNode = path[pathIndex + 1] || path[pathIndex];
        
        const lat = startNode.lat + (endNode.lat - startNode.lat) * progress;
        const lng = startNode.lng + (endNode.lng - startNode.lng) * progress;
        
        loc.currentLocation = { lat, lng };
        await loc.save();
      }
    } catch (e) {
      console.error('Simulation error', e);
    }
  }, 5000);
};

module.exports = runSimulation;
