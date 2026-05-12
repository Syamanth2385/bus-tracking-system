import React, { createContext, useState, useEffect, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { globalPaths as initialGlobalPaths } from '../data/routePaths';

const BusContext = createContext();

export const cityCoords = {
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

export const availableBusesData = [
  { location: 'Amritsar: Central Bus Stand', count: 32, color: '#3b82f6', searchHint: 'amritsar' },
  { location: 'Jalandhar: Shaheed Bhagat Singh ISBT', count: 28, color: '#f59e0b', searchHint: 'jalandhar' },
  { location: 'Ludhiana: Main Bus Stand & Sherpur', count: 45, color: '#10b981', searchHint: 'ludhiana' },
  { location: 'Pathankot: Maharana Pratap ISBT', count: 15, color: '#8b5cf6', searchHint: 'pathankot' },
  { location: 'Bathinda: Main Bus Stand', count: 22, color: '#ef4444', searchHint: 'bathinda' },
  { location: 'Moga: Bus Stand', count: 12, color: '#06b6d4', searchHint: 'moga' },
  { location: 'Hoshiarpur: Bus Stand', count: 18, color: '#f97316', searchHint: 'hoshiarpur' },
  { location: 'Mohali: Baba Banda Singh Bahadur ISBT', count: 35, color: '#6366f1', searchHint: 'mohali' },
  { location: 'Batala: Bus Stand', count: 10, color: '#14b8a6', searchHint: 'batala' },
  { location: 'Kharar: Bus Stand', count: 14, color: '#84cc16', searchHint: 'kharar' }
];

const generateMockBuses = (paths) => {
  const routes = [
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

  routes.forEach(route => {
    route.path = route.stops.map(stop => cityCoords[stop]).filter(Boolean);
  });

  const traffic = ['Clear', 'Moderate', 'Heavy'];
  const buses = [];
  let idCounter = 1;

  routes.forEach(route => {
    for (let i = 0; i < 4; i++) {
      const pathSource = paths[route.name] && paths[route.name].length > 1 ? paths[route.name] : route.path;
      if (!pathSource || pathSource.length < 2) continue;
      
      const pathIndex = Math.floor(Math.random() * (pathSource.length - 1));
      const progress = Math.random();
      const startNode = pathSource[pathIndex];
      const endNode = pathSource[pathIndex + 1];
      const lat = startNode.lat + (endNode.lat - startNode.lat) * progress;
      const lng = startNode.lng + (endNode.lng - startNode.lng) * progress;

      buses.push({
        id: `mock${idCounter++}`,
        busNumber: `PB${String(Math.floor(Math.random() * 99)).padStart(2, '0')}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9000) + 1000}`,
        route: route,
        currentLocation: { lat, lng },
        speed: Math.floor(Math.random() * 30) + 40,
        trafficCondition: traffic[Math.floor(Math.random() * traffic.length)],
        pathIndex,
        progress
      });
    }
  });
  return buses.sort(() => 0.5 - Math.random());
};

export const BusProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [globalPaths, setGlobalPaths] = useState(initialGlobalPaths);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    // Generate initial mocks using available paths
    setBuses(generateMockBuses(globalPaths));
  }, []);

  // Fetch DB buses periodically
  useEffect(() => {
    const fetchDbBuses = async () => {
      try {
        const response = await fetch('/api/tracking');
        if (!response.ok) return;
        const data = await response.json();
        
        const mappedDbBuses = data.map(dbBus => {
           let stops = [];
           if (dbBus.route?.origin && dbBus.route?.destination) {
             stops = [dbBus.route.origin.toLowerCase(), dbBus.route.destination.toLowerCase()];
           }
           return {
             id: dbBus._id,
             busNumber: dbBus.bus?.busNumber || 'Unknown',
             route: {
               name: dbBus.route?.routeName || 'Unknown Route',
               stops: stops,
               path: dbBus.route?.pathCoordinates || []
             },
             currentLocation: dbBus.currentLocation,
             speed: dbBus.speed || 40,
             trafficCondition: dbBus.trafficCondition || 'Clear',
             isDbBus: true,
             bus: dbBus.bus,
             fullRoute: dbBus.route,
             updatedAt: dbBus.updatedAt
           };
        });
        
        setBuses(prevBuses => {
           const mockOnly = prevBuses.filter(b => !b.isDbBus);
           const dbOnly = prevBuses.filter(b => b.isDbBus);

           const updatedDbBuses = mappedDbBuses.map(newBus => {
             const existingBus = dbOnly.find(b => b.id === newBus.id);
             if (existingBus) {
               return { 
                 ...newBus, 
                 currentLocation: existingBus.currentLocation, 
                 pathIndex: existingBus.pathIndex, 
                 progress: existingBus.progress 
               };
             }
             return newBus;
           });

           return [...mockOnly, ...updatedDbBuses];
        });
      } catch (e) {
        console.error('Failed to fetch DB buses', e);
      }
    };
    
    fetchDbBuses();
    const intervalId = setInterval(fetchDbBuses, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const [isFetchingPaths, setIsFetchingPaths] = useState(false);

  // Fetch true Google Maps paths for routes lacking them
  useEffect(() => {
    if (!isLoaded || !window.google || isFetchingPaths) return;

    // Identify routes that need path fetching
    const routesToFetch = [];
    const seenRoutes = new Set();

    buses.forEach(b => {
      if (!b.route || !b.route.stops || b.route.stops.length < 2) return;
      const routeName = b.route.name || '';
      const routeNameLower = routeName.toLowerCase();
      if (seenRoutes.has(routeNameLower)) return;
      
      const matchedGlobalKey = Object.keys(globalPaths).find(k => k.toLowerCase() === routeNameLower);
      if (!matchedGlobalKey || globalPaths[matchedGlobalKey].length <= 2) {
         routesToFetch.push(b);
         seenRoutes.add(routeNameLower);
      }
    });

    if (routesToFetch.length === 0) return;

    const fetchMissingPaths = async () => {
      setIsFetchingPaths(true);
      const directionsService = new window.google.maps.DirectionsService();
      let updatedPaths = { ...globalPaths };
      let madeChanges = false;
      
      for (const bus of routesToFetch) {
        const stops = bus.route.stops;
        const originCoord = cityCoords[stops[0]] || stops[0];
        const destCoord = cityCoords[stops[stops.length - 1]] || stops[stops.length - 1];
        
        if (!originCoord || !destCoord) continue;
        
        const waypoints = stops.slice(1, -1).map(stop => ({
          location: cityCoords[stop] || stop,
          stopover: true
        }));

        try {
          const result = await new Promise((resolve, reject) => {
            directionsService.route({
              origin: originCoord,
              destination: destCoord,
              waypoints: waypoints,
              travelMode: window.google.maps.TravelMode.DRIVING,
            }, (res, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                resolve(res);
              } else {
                reject(status);
              }
            });
          });
          
          if (result && result.routes && result.routes[0]) {
            const highResPath = [];
            result.routes[0].legs.forEach(leg => {
              leg.steps.forEach(step => {
                step.path.forEach(p => {
                  highResPath.push({ lat: p.lat(), lng: p.lng() });
                });
              });
            });
            updatedPaths[bus.route.name] = highResPath;
            madeChanges = true;
          }
        } catch (e) {
          console.error('DirectionsService failed for', bus.route.name, e);
          if (String(e).includes('REQUEST_DENIED') || String(e).includes('OVER_QUERY_LIMIT')) {
             console.warn('Directions API limit reached or denied. Aborting dynamic route fetching.');
             break;
          }
        }
        
        await new Promise(r => setTimeout(r, 600));
      }
      
      if (madeChanges) {
        setGlobalPaths(updatedPaths);
        setBuses(prev => prev.map(bus => {
          const rName = bus.route.name ? bus.route.name.toLowerCase() : '';
          const mKey = Object.keys(updatedPaths).find(k => k.toLowerCase() === rName);
          if (mKey && updatedPaths[mKey].length > 0) {
            const pSource = updatedPaths[mKey];
            let minDist = Infinity;
            let bestIndex = 0;
            if (bus.currentLocation) {
              pSource.forEach((pt, idx) => {
                const d = Math.pow(pt.lat - bus.currentLocation.lat, 2) + Math.pow(pt.lng - bus.currentLocation.lng, 2);
                if (d < minDist) { minDist = d; bestIndex = idx; }
              });
            }
            return { ...bus, pathIndex: bestIndex, progress: 0 };
          }
          return bus;
        }));
      }
      setIsFetchingPaths(false);
    };

    fetchMissingPaths();
  }, [buses, isLoaded, globalPaths, isFetchingPaths]);

  // Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => prevBuses.map(bus => {

        const routeNameLower = bus.route.name ? bus.route.name.toLowerCase() : '';
        const matchedGlobalKey = Object.keys(globalPaths).find(k => k.toLowerCase() === routeNameLower);
        
        let currentPathSource = matchedGlobalKey && globalPaths[matchedGlobalKey].length > 1 
                                  ? globalPaths[matchedGlobalKey] 
                                  : bus.route.path;

        if (!currentPathSource || currentPathSource.length < 2) {
            // Try resolving stops if path not available
            if (bus.route && bus.route.stops && bus.route.stops.length >= 2) {
                currentPathSource = bus.route.stops.map(s => cityCoords[s?.toLowerCase()]).filter(Boolean);
            }
        }
        
        // Fallback: If absolutely no path is found, simulate a small back-and-forth movement around its origin
        if (!currentPathSource || currentPathSource.length < 2) {
            const loc = bus.currentLocation || { lat: 31.6340, lng: 74.8723 }; // Default Amritsar
            currentPathSource = [
                { lat: loc.lat, lng: loc.lng },
                { lat: loc.lat + 0.005, lng: loc.lng + 0.005 },
                { lat: loc.lat, lng: loc.lng - 0.005 }
            ];
        }
        
        let { pathIndex, progress } = bus;
        if (pathIndex === undefined) pathIndex = 0;
        if (progress === undefined) progress = 0;

        const trafficMultiplier = bus.trafficCondition === 'Heavy' ? 0.05 : (bus.trafficCondition === 'Moderate' ? 0.1 : 0.2);
        
        // When using high-res paths, we have many points close together. We need to normalize speed based on node distances.
        const startNode = currentPathSource[pathIndex];
        const endNode = currentPathSource[pathIndex + 1] || currentPathSource[pathIndex];
        
        // Approximate distance between startNode and endNode in degrees
        const distSq = Math.pow(endNode.lat - startNode.lat, 2) + Math.pow(endNode.lng - startNode.lng, 2);
        const dist = Math.sqrt(distSq) || 0.0001; 
        
        // Standardize step progress based on distance to move at uniform real-world speed
        const baseSpeed = bus.speed * trafficMultiplier * 100; // tunable scaling factor
        const stepProgress = baseSpeed / dist;
        
        progress += stepProgress;

        if (progress >= 1) {
          progress = 0;
          pathIndex++;
        }

        if (pathIndex >= currentPathSource.length - 1) {
           pathIndex = 0;
        }
        
        // Get fresh references for current calculation
        const currentStart = currentPathSource[pathIndex];
        const currentEnd = currentPathSource[pathIndex + 1] || currentPathSource[pathIndex];
        
        const lat = currentStart.lat + (currentEnd.lat - currentStart.lat) * progress;
        const lng = currentStart.lng + (currentEnd.lng - currentStart.lng) * progress;

        return {
          ...bus,
          pathIndex,
          progress,
          currentLocation: { lat, lng }
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [globalPaths]);

  const contextValue = React.useMemo(() => ({
    buses, globalPaths, cityCoords, availableBusesData, isLoaded, loadError
  }), [buses, globalPaths, isLoaded, loadError]);

  return (
    <BusContext.Provider value={contextValue}>
      {children}
    </BusContext.Provider>
  );
};

export const useBusData = () => useContext(BusContext);
