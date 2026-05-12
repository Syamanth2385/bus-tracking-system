const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Route = require('./models/Route');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const cityCoords = {
  'amritsar': {lat: 31.6340, lng: 74.8723},
  'jalandhar': {lat: 31.3260, lng: 75.5762},
  'ludhiana': {lat: 30.9010, lng: 75.8573},
  'pathankot': {lat: 32.2643, lng: 75.6508},
  'bathinda': {lat: 30.2110, lng: 74.9455},
  'moga': {lat: 30.8166, lng: 75.1717},
  'hoshiarpur': {lat: 31.5293, lng: 75.9065},
  'mohali': {lat: 30.7046, lng: 76.7179},
  'chandigarh': {lat: 30.7333, lng: 76.7794},
  'patiala': {lat: 30.3398, lng: 76.3869},
  'batala': {lat: 31.8186, lng: 75.2028},
  'kharar': {lat: 30.7410, lng: 76.6456},
  'nakodar': {lat: 31.1256, lng: 75.4746},
  'fatehgarh churian': {lat: 31.8214, lng: 74.9421},
  'sangrur': {lat: 30.2458, lng: 75.8421},
  'phagwara': {lat: 31.2240, lng: 75.7700},
  'beas': {lat: 31.5120, lng: 75.2930},
  'tarn taran': {lat: 31.4520, lng: 74.9250},
  'sirhind': {lat: 30.6210, lng: 76.3920},
  'khanna': {lat: 30.7040, lng: 76.2220},
  'mandi gobindgarh': {lat: 30.6590, lng: 76.3020},
  'goraya': {lat: 31.1340, lng: 75.8530},
  'kartarpur': {lat: 31.4390, lng: 75.4980},
  'jandiala guru': {lat: 31.5640, lng: 75.0230},
  'mukerian': {lat: 31.9540, lng: 75.6180},
  'dasuya': {lat: 31.8150, lng: 75.6580},
  'tanda': {lat: 31.6660, lng: 75.6320},
  'kotkapura': {lat: 30.5820, lng: 74.8250},
  'faridkot': {lat: 30.6769, lng: 74.7271},
  'firozpur': {lat: 30.9255, lng: 74.6095},
  'nabha': {lat: 30.3730, lng: 76.1460},
  'dhuri': {lat: 30.3700, lng: 75.8670},
  'malerkotla': {lat: 30.5230, lng: 75.8850},
  'jagraon': {lat: 30.7820, lng: 75.4760},
  'samrala': {lat: 30.8350, lng: 76.1900},
  'morinda': {lat: 30.7950, lng: 76.5020},
  'nawanshahr': {lat: 31.1260, lng: 76.1170},
  'ropar': {lat: 30.9664, lng: 76.5331},
  'zira': {lat: 30.9700, lng: 74.9850},
  'makhu': {lat: 31.0960, lng: 75.0060},
  'bhogpur': {lat: 31.5470, lng: 75.6300},
  'gurdaspur': {lat: 32.0419, lng: 75.4053}
};

const routeDefinitions = [
    { name: 'Amritsar to Chandigarh', stops: ['amritsar', 'jandiala guru', 'beas', 'kartarpur', 'jalandhar', 'phagwara', 'goraya', 'ludhiana', 'khanna', 'mandi gobindgarh', 'sirhind', 'kharar', 'mohali', 'chandigarh'] },
    { name: 'Pathankot to Bathinda', stops: ['pathankot', 'mukerian', 'dasuya', 'tanda', 'bhogpur', 'jalandhar', 'nakodar', 'moga', 'jagraon', 'kotkapura', 'faridkot', 'bathinda'] },
    { name: 'Patiala to Amritsar', stops: ['patiala', 'nabha', 'dhuri', 'malerkotla', 'ludhiana', 'phagwara', 'jalandhar', 'kartarpur', 'beas', 'jandiala guru', 'amritsar'] },
    { name: 'Firozpur to Chandigarh', stops: ['firozpur', 'faridkot', 'kotkapura', 'moga', 'jagraon', 'ludhiana', 'samrala', 'morinda', 'kharar', 'mohali', 'chandigarh'] },
    { name: 'Hoshiarpur to Sangrur', stops: ['hoshiarpur', 'phagwara', 'nawanshahr', 'ropar', 'morinda', 'sirhind', 'patiala', 'nabha', 'sangrur'] },
    { name: 'Bathinda to Amritsar', stops: ['bathinda', 'kotkapura', 'faridkot', 'firozpur', 'zira', 'makhu', 'tarn taran', 'jandiala guru', 'amritsar'] },
    { name: 'Pathankot to Jalandhar', stops: ['pathankot', 'mukerian', 'dasuya', 'tanda', 'bhogpur', 'kartarpur', 'jalandhar'] },
    { name: 'Amritsar to Pathankot', stops: ['amritsar', 'fatehgarh churian', 'batala', 'gurdaspur', 'mukerian', 'pathankot'] },
    { name: 'Moga to Jalandhar', stops: ['moga', 'nakodar', 'jalandhar'] },
    { name: 'Amritsar to Jalandhar', stops: ['amritsar', 'jandiala guru', 'beas', 'kartarpur', 'jalandhar'] },
    { name: 'Ludhiana to Amritsar', stops: ['ludhiana', 'goraya', 'phagwara', 'jalandhar', 'kartarpur', 'beas', 'jandiala guru', 'amritsar'] },
    { name: 'Mohali to Amritsar', stops: ['mohali', 'kharar', 'sirhind', 'khanna', 'ludhiana', 'phagwara', 'jalandhar', 'beas', 'amritsar'] },
    { name: 'Chandigarh to Jalandhar', stops: ['chandigarh', 'mohali', 'kharar', 'sirhind', 'ludhiana', 'goraya', 'phagwara', 'jalandhar'] },
    { name: 'Moga to Mohali', stops: ['moga', 'jagraon', 'ludhiana', 'samrala', 'kharar', 'mohali'] },
    { name: 'Ludhiana to Bathinda', stops: ['ludhiana', 'jagraon', 'moga', 'kotkapura', 'bathinda'] },
    { name: 'Jalandhar to Hoshiarpur', stops: ['jalandhar', 'bhogpur', 'tanda', 'hoshiarpur'] },
    { name: 'Chandigarh to Patiala', stops: ['chandigarh', 'mohali', 'kharar', 'sirhind', 'patiala'] },
    { name: 'Ludhiana to Hoshiarpur', stops: ['ludhiana', 'phagwara', 'jalandhar', 'bhogpur', 'hoshiarpur'] },
    { name: 'Amritsar to Firozpur', stops: ['amritsar', 'tarn taran', 'makhu', 'zira', 'firozpur'] },
    { name: 'Patiala to Bathinda', stops: ['patiala', 'nabha', 'dhuri', 'sangrur', 'bathinda'] },
    { name: 'Moga to Amritsar', stops: ['moga', 'zira', 'makhu', 'tarn taran', 'amritsar'] },
    { name: 'Pathankot to Chandigarh', stops: ['pathankot', 'mukerian', 'dasuya', 'tanda', 'jalandhar', 'phagwara', 'ludhiana', 'sirhind', 'kharar', 'mohali', 'chandigarh'] },
    { name: 'Hoshiarpur to Chandigarh', stops: ['hoshiarpur', 'nawanshahr', 'ropar', 'kharar', 'mohali', 'chandigarh'] }
];

const addRoutes = async () => {
  try {
    for (let def of routeDefinitions) {
      // Check if route exists to avoid duplicates
      const exists = await Route.findOne({ routeName: def.name });
      if (exists) {
        console.log(`Route already exists: ${def.name}`);
        continue;
      }

      const stopsObjects = def.stops.map((stop, idx) => ({
        stopName: stop.charAt(0).toUpperCase() + stop.slice(1),
        location: cityCoords[stop],
        estimatedTimeFromOrigin: idx * 45 // mock time
      }));

      const pathCoords = def.stops.map(stop => cityCoords[stop]).filter(Boolean);

      const newRoute = new Route({
        routeName: def.name,
        origin: def.stops[0].charAt(0).toUpperCase() + def.stops[0].slice(1),
        destination: def.stops[def.stops.length - 1].charAt(0).toUpperCase() + def.stops[def.stops.length - 1].slice(1),
        stops: stopsObjects,
        pathCoordinates: pathCoords
      });

      await newRoute.save();
      console.log(`Added route: ${def.name}`);
    }
    console.log('Finished adding routes!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

addRoutes();
