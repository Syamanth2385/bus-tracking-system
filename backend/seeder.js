const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Bus = require('./models/Bus');
const Route = require('./models/Route');
const BusLocation = require('./models/BusLocation');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Bus.deleteMany();
    await Route.deleteMany();
    await BusLocation.deleteMany();

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      phone: '1234567890'
    });

    // Create sample routes in Punjab
    const routesData = [
      {
        routeName: 'Chandigarh to Amritsar',
        origin: 'Chandigarh',
        destination: 'Amritsar',
        stops: [
          { stopName: 'Chandigarh', location: { lat: 30.7333, lng: 76.7794 }, estimatedTimeFromOrigin: 0 },
          { stopName: 'Ludhiana', location: { lat: 30.9010, lng: 75.8573 }, estimatedTimeFromOrigin: 120 },
          { stopName: 'Jalandhar', location: { lat: 31.3260, lng: 75.5762 }, estimatedTimeFromOrigin: 180 },
          { stopName: 'Amritsar', location: { lat: 31.6340, lng: 74.8723 }, estimatedTimeFromOrigin: 240 }
        ],
        pathCoordinates: [
          { lat: 30.7333, lng: 76.7794 },
          { lat: 30.9010, lng: 75.8573 },
          { lat: 31.3260, lng: 75.5762 },
          { lat: 31.6340, lng: 74.8723 }
        ]
      },
      {
        routeName: 'Patiala to Pathankot',
        origin: 'Patiala',
        destination: 'Pathankot',
        stops: [
          { stopName: 'Patiala', location: { lat: 30.3398, lng: 76.3869 }, estimatedTimeFromOrigin: 0 },
          { stopName: 'Ludhiana', location: { lat: 30.9010, lng: 75.8573 }, estimatedTimeFromOrigin: 90 },
          { stopName: 'Pathankot', location: { lat: 32.2643, lng: 75.6433 }, estimatedTimeFromOrigin: 240 }
        ],
        pathCoordinates: [
          { lat: 30.3398, lng: 76.3869 },
          { lat: 30.9010, lng: 75.8573 },
          { lat: 32.2643, lng: 75.6433 }
        ]
      },
      {
        routeName: 'Bathinda to Amritsar',
        origin: 'Bathinda',
        destination: 'Amritsar',
        stops: [
          { stopName: 'Bathinda', location: { lat: 30.2110, lng: 74.9455 }, estimatedTimeFromOrigin: 0 },
          { stopName: 'Kotkapura', location: { lat: 30.5820, lng: 74.8250 }, estimatedTimeFromOrigin: 60 },
          { stopName: 'Firozpur', location: { lat: 30.9255, lng: 74.6095 }, estimatedTimeFromOrigin: 120 },
          { stopName: 'Amritsar', location: { lat: 31.6340, lng: 74.8723 }, estimatedTimeFromOrigin: 240 }
        ],
        pathCoordinates: [
          { lat: 30.2110, lng: 74.9455 },
          { lat: 30.5820, lng: 74.8250 },
          { lat: 30.9255, lng: 74.6095 },
          { lat: 31.6340, lng: 74.8723 }
        ]
      },
      {
        routeName: 'Moga to Jalandhar',
        origin: 'Moga',
        destination: 'Jalandhar',
        stops: [
          { stopName: 'Moga', location: { lat: 30.8166, lng: 75.1717 }, estimatedTimeFromOrigin: 0 },
          { stopName: 'Nakodar', location: { lat: 31.1256, lng: 75.4746 }, estimatedTimeFromOrigin: 60 },
          { stopName: 'Jalandhar', location: { lat: 31.3260, lng: 75.5762 }, estimatedTimeFromOrigin: 90 }
        ],
        pathCoordinates: [
          { lat: 30.8166, lng: 75.1717 },
          { lat: 31.1256, lng: 75.4746 },
          { lat: 31.3260, lng: 75.5762 }
        ]
      },
      {
        routeName: 'Hoshiarpur to Sangrur',
        origin: 'Hoshiarpur',
        destination: 'Sangrur',
        stops: [
          { stopName: 'Hoshiarpur', location: { lat: 31.5293, lng: 75.9065 }, estimatedTimeFromOrigin: 0 },
          { stopName: 'Phagwara', location: { lat: 31.2240, lng: 75.7700 }, estimatedTimeFromOrigin: 45 },
          { stopName: 'Patiala', location: { lat: 30.3398, lng: 76.3869 }, estimatedTimeFromOrigin: 150 },
          { stopName: 'Sangrur', location: { lat: 30.2458, lng: 75.8421 }, estimatedTimeFromOrigin: 200 }
        ],
        pathCoordinates: [
          { lat: 31.5293, lng: 75.9065 },
          { lat: 31.2240, lng: 75.7700 },
          { lat: 30.3398, lng: 76.3869 },
          { lat: 30.2458, lng: 75.8421 }
        ]
      },
      {
        routeName: 'Ludhiana to Bathinda',
        origin: 'Ludhiana',
        destination: 'Bathinda',
        stops: [
          { stopName: 'Ludhiana', location: { lat: 30.9010, lng: 75.8573 }, estimatedTimeFromOrigin: 0 },
          { stopName: 'Jagraon', location: { lat: 30.7820, lng: 75.4760 }, estimatedTimeFromOrigin: 45 },
          { stopName: 'Moga', location: { lat: 30.8166, lng: 75.1717 }, estimatedTimeFromOrigin: 90 },
          { stopName: 'Bathinda', location: { lat: 30.2110, lng: 74.9455 }, estimatedTimeFromOrigin: 150 }
        ],
        pathCoordinates: [
          { lat: 30.9010, lng: 75.8573 },
          { lat: 30.7820, lng: 75.4760 },
          { lat: 30.8166, lng: 75.1717 },
          { lat: 30.2110, lng: 74.9455 }
        ]
      },
      {
        routeName: 'Jalandhar to Hoshiarpur',
        origin: 'Jalandhar',
        destination: 'Hoshiarpur',
        stops: [
          { stopName: 'Jalandhar', location: { lat: 31.3260, lng: 75.5762 }, estimatedTimeFromOrigin: 0 },
          { stopName: 'Bhogpur', location: { lat: 31.5470, lng: 75.6300 }, estimatedTimeFromOrigin: 30 },
          { stopName: 'Tanda', location: { lat: 31.6660, lng: 75.6320 }, estimatedTimeFromOrigin: 60 },
          { stopName: 'Hoshiarpur', location: { lat: 31.5293, lng: 75.9065 }, estimatedTimeFromOrigin: 90 }
        ],
        pathCoordinates: [
          { lat: 31.3260, lng: 75.5762 },
          { lat: 31.5470, lng: 75.6300 },
          { lat: 31.6660, lng: 75.6320 },
          { lat: 31.5293, lng: 75.9065 }
        ]
      }
    ];

    const createdRoutes = await Route.insertMany(routesData);

    // Create 70 buses and their locations
    const busesData = [];
    const busLocationsData = [];

    for (let i = 1; i <= 70; i++) {
      const routeAssigned = createdRoutes[i % createdRoutes.length];
      const busNumber = `PB-${Math.floor(Math.random() * 90) + 10}-${Math.floor(1000 + Math.random() * 9000)}`;
      const type = i % 3 === 0 ? 'AC' : 'Non-AC';
      
      const newBus = new Bus({
        busNumber,
        capacity: 50,
        type,
        driverName: `Driver ${i}`,
        status: 'Active',
        route: routeAssigned._id
      });
      busesData.push(newBus);

      // Random position along the route
      const stopIndex = Math.floor(Math.random() * (routeAssigned.stops.length - 1));
      const currentStop = routeAssigned.stops[stopIndex];
      const nextStop = routeAssigned.stops[stopIndex + 1];

      // Interpolate between stops slightly for realism
      const fraction = Math.random();
      const currentLat = currentStop.location.lat + fraction * (nextStop.location.lat - currentStop.location.lat);
      const currentLng = currentStop.location.lng + fraction * (nextStop.location.lng - currentStop.location.lng);

      const trafficConditions = ['Clear', 'Moderate', 'Heavy'];
      const randomTraffic = trafficConditions[Math.floor(Math.random() * trafficConditions.length)];
      
      let speed = 60; // default clear
      if (randomTraffic === 'Moderate') speed = 40;
      if (randomTraffic === 'Heavy') speed = 20;

      const newLocation = new BusLocation({
        bus: newBus._id,
        route: routeAssigned._id,
        currentLocation: { lat: currentLat, lng: currentLng },
        speed,
        trafficCondition: randomTraffic,
        nextStop: {
          stopName: nextStop.stopName,
          eta: Math.floor(Math.random() * 60) + 10
        },
        availableSeats: Math.floor(Math.random() * 50)
      });
      
      busLocationsData.push(newLocation);
    }

    await Bus.insertMany(busesData);
    await BusLocation.insertMany(busLocationsData);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
