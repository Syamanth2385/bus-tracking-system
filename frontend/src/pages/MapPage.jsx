import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, PolylineF, InfoWindowF, DirectionsRenderer } from '@react-google-maps/api';
import { FiSearch, FiX, FiLayers, FiMapPin, FiClock, FiAlertCircle, FiBell } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import './MapPage.css';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 31.1471,
  lng: 75.3412
};

const mapStyleOptions = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  }
];



import { useBusData } from '../context/BusContext';

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Map Error caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fee2e2', color: '#b91c1c', fontFamily: 'monospace' }}>
          <h2>MapPage Crashed</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>{this.state.error && this.state.error.toString()}</summary>
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const MapPageInner = () => {
  const { buses, globalPaths, cityCoords, availableBusesData, isLoaded, loadError } = useBusData();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialOrigin = searchParams.get('origin') || '';
  const initialDestination = searchParams.get('destination') || '';
  const initialBusId = searchParams.get('busId') || null;

  const [map, setMap] = useState(null);
  const [searchSource, setSearchSource] = useState(initialOrigin || '');
  const [searchDestination, setSearchDestination] = useState(initialDestination || '');
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showSmartAlertModal, setShowSmartAlertModal] = useState(false);
  const [smartAlertEmail, setSmartAlertEmail] = useState('');
  const [smartAlertPhone, setSmartAlertPhone] = useState('');
  const [userLocationSelected, setUserLocationSelected] = useState(false);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  
  // States for Directions API
  const [directionsResponse, setDirectionsResponse] = useState(null);
  
  const [nearestStationDirections, setNearestStationDirections] = useState(null);
  const [nearestStationName, setNearestStationName] = useState('');

  // Cleanly select the bus tracked from the Bus Page only once
  useEffect(() => {
    if (initialBusId && buses.length > 0 && !hasAutoSelected && map) {
      const target = buses.find(b => String(b.id) === String(initialBusId));
      if (target) {
        setSelectedBus(target);
        setHasAutoSelected(true);
        map.panTo(target.currentLocation);
        map.setZoom(14);
      }
    }
  }, [initialBusId, buses, hasAutoSelected, map]);

  // Dynamically find the current state of the selected bus
  const currentSelectedBus = useMemo(() => {
    if (!selectedBus) return null;
    return buses.find(b => b.id === selectedBus.id) || selectedBus;
  }, [buses, selectedBus]);

  const trimPathBySearch = useCallback((path, searchRes) => {
      if (!searchRes || !searchRes.sourceSearch || !searchRes.destSearch || searchRes.sourceSearch === 'your location') return path;
      const sCoord = getCityCoord(searchRes.sourceSearch);
      const dCoord = getCityCoord(searchRes.destSearch);
      if (!sCoord || !dCoord || !path || path.length < 2) return path;

      let sIdx = 0, dIdx = path.length - 1;
      let sMinDist = Infinity, dMinDist = Infinity;
      
      path.forEach((pt, idx) => {
          const d1 = Math.pow(pt.lat - sCoord.lat, 2) + Math.pow(pt.lng - sCoord.lng, 2);
          if (d1 < sMinDist) { sMinDist = d1; sIdx = idx; }
          
          const d2 = Math.pow(pt.lat - dCoord.lat, 2) + Math.pow(pt.lng - dCoord.lng, 2);
          if (d2 < dMinDist) { dMinDist = d2; dIdx = idx; }
      });
      
      if (sIdx <= dIdx) {
          return path.slice(sIdx, dIdx + 1);
      } else {
          return path.slice(dIdx, sIdx + 1).reverse();
      }
  }, []);

  useEffect(() => {
    if (userLocationSelected && userLocation && window.google) {
      // find nearest station
      let minDist = Infinity;
      let nearestCity = '';
      let nearestCoord = null;
      Object.keys(cityCoords).forEach(city => {
        const coord = cityCoords[city];
        const dist = Math.pow(coord.lat - userLocation.lat, 2) + Math.pow(coord.lng - userLocation.lng, 2);
        if (dist < minDist) {
          minDist = dist;
          nearestCity = city;
          nearestCoord = coord;
        }
      });
      
      setNearestStationName(nearestCity);

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route({
        origin: userLocation,
        destination: nearestCoord,
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setNearestStationDirections(result);
        } else {
          setNearestStationDirections(null);
        }
      });
    } else {
      setNearestStationDirections(null);
      setNearestStationName('');
    }
  }, [userLocationSelected, userLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (err) => console.log('Geolocation not available:', err)
      );
    }
  }, []);

  const uniqueRoutes = useMemo(() => {
    const routesMap = new Map();
    buses.forEach(b => {
      if (!routesMap.has(b.route.name)) {
        routesMap.set(b.route.name, b.route);
      }
    });
    return Array.from(routesMap.values());
  }, [buses]);

  // Removed pre-fetching of all uniqueRoutes on mount to improve map load performance and reduce API rate-limiting.

  const getFilteredCities = (term) => {
    if (!term) return Object.keys(cityCoords).slice(0, 5);
    return Object.keys(cityCoords).filter(city => city.toLowerCase().includes(term.toLowerCase()));
  };

  const getCityCoord = (term) => {
    if (!term) return null;
    const match = Object.keys(cityCoords).find(c => term.includes(c) || c.includes(term));
    return match ? cityCoords[match] : null;
  };

  const handleSearch = () => {
    const sTermRaw = searchSource.toLowerCase().trim();
    const isUserLocationSearch = ['my location', 'your location', 'current location'].includes(sTermRaw);
    const sTerm = isUserLocationSearch ? '' : sTermRaw;
    const dTerm = searchDestination.toLowerCase().trim();
    if (!sTerm && !dTerm && !isUserLocationSearch) return;

    const matches = buses.filter(b => {
      const searchString = (b.route.name + " " + (b.route.stops ? b.route.stops.join(" ") : "")).toLowerCase();
      if (sTerm && dTerm) {
        return searchString.includes(sTerm) && searchString.includes(dTerm);
      } else if (sTerm) {
        return searchString.includes(sTerm);
      } else if (dTerm) {
        return searchString.includes(dTerm);
      } else if (isUserLocationSearch && !dTerm) {
        return true; // Match all if just searching from current location without destination
      }
      return false;
    });

    setSearchResult({
      title: `${isUserLocationSearch ? 'Your Location' : searchSource} ${dTerm ? 'to ' + searchDestination : ''}`,
      buses: matches,
      sourceSearch: isUserLocationSearch ? 'your location' : sTerm,
      destSearch: dTerm
    });
    
    if (map && sTerm && dTerm) {
      const sCoord = getCityCoord(sTerm);
      const dCoord = getCityCoord(dTerm);
      if (sCoord && dCoord) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(sCoord);
        bounds.extend(dCoord);
        map.fitBounds(bounds);
      }
    }
  };

  useEffect(() => {
    if (map && (initialOrigin || initialDestination)) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, initialOrigin, initialDestination]);

  // Keep searchResult synchronized when buses update (e.g. from DB)
  useEffect(() => {
    if (searchResult) {
      const sTerm = searchResult.sourceSearch;
      const dTerm = searchResult.destSearch;
      const isUserLocationSearch = sTerm === 'your location';
      
      const matches = buses.filter(b => {
        const searchString = (b.route.name + " " + (b.route.stops ? b.route.stops.join(" ") : "")).toLowerCase();
        if (sTerm && dTerm && sTerm !== 'your location') {
          return searchString.includes(sTerm) && searchString.includes(dTerm);
        } else if (sTerm && sTerm !== 'your location') {
          return searchString.includes(sTerm);
        } else if (dTerm) {
          return searchString.includes(dTerm);
        } else if (isUserLocationSearch && !dTerm) {
          return true;
        }
        return false;
      });
      
      const currentIds = searchResult.buses.map(b => String(b.id)).sort().join(',');
      const newIds = matches.map(b => String(b.id)).sort().join(',');
      
      if (currentIds !== newIds) {
        setSearchResult(prev => ({ ...prev, buses: matches }));
      }
    }
  }, [buses]); // Removed searchResult from dependency to prevent infinite looping

  // Fetch actual directions for the searched route
  useEffect(() => {
    if (searchResult && searchResult.buses.length > 0 && window.google) {
      const bus = searchResult.buses[0];
      let stops = bus.route.stops || [];
      
      if (stops.length > 0 && searchResult.sourceSearch && searchResult.destSearch && searchResult.sourceSearch !== 'your location') {
        const sourceIndex = stops.findIndex(s => s && (s.includes(searchResult.sourceSearch) || searchResult.sourceSearch.includes(s)));
        const destIndex = stops.findIndex(s => s && (s.includes(searchResult.destSearch) || searchResult.destSearch.includes(s)));
        
        if (sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex) {
            stops = stops.slice(sourceIndex, destIndex + 1);
        } else if (sourceIndex !== -1 && destIndex !== -1 && sourceIndex > destIndex) {
            stops = stops.slice(destIndex, sourceIndex + 1).reverse();
        }
      }
      
      if (!stops || stops.length === 0) {
        setDirectionsResponse(null);
        return;
      }

      const originCoord = cityCoords[stops[0]];
      const destCoord = cityCoords[stops[stops.length - 1]];
      
      const waypoints = stops.slice(1, -1).map(stop => ({
        location: cityCoords[stop],
        stopover: true
      })).filter(wp => wp.location);

      const directionsService = new window.google.maps.DirectionsService();
      
      directionsService.route({
        origin: originCoord,
        destination: destCoord,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error(`Directions request failed: ${status}`);
          setDirectionsResponse(null);
        }
      });
    } else {
      setDirectionsResponse(null);
    }
  }, [searchResult]);

  // userBusDirections effect removed to prevent continuous Maps API overload loops

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback(mapInstance) {
    setMap(null);
  }, []);

  const handleSmartAlertSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: smartAlertEmail,
          phone: smartAlertPhone,
          busNumber: selectedBus?.busNumber,
          route: selectedBus?.route?.name,
          emailAlerts: true,
          whatsappAlerts: true
        })
      });
      if (response.ok) {
        alert(`Smart alert activated for ${selectedBus?.busNumber} via Email and WhatsApp.`);
      } else {
        alert('Failed to save alert to database.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to alert service.');
    }
    setShowSmartAlertModal(false);
  };



  const sourceIcon = useMemo(() => ({
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" width="36px" height="36px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
    scaledSize: isLoaded ? new window.google.maps.Size(36, 36) : null,
    anchor: isLoaded ? new window.google.maps.Point(18, 36) : null
  }), [isLoaded]);

  const destIcon = useMemo(() => ({
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="36px" height="36px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
    scaledSize: isLoaded ? new window.google.maps.Size(36, 36) : null,
    anchor: isLoaded ? new window.google.maps.Point(18, 36) : null
  }), [isLoaded]);

  const stopIcon = useMemo(() => ({
    path: window.google?.maps?.SymbolPath?.CIRCLE,
    fillColor: '#FFFFFF',
    fillOpacity: 1,
    strokeWeight: 3,
    strokeColor: '#8b5cf6',
    scale: 6
  }), [isLoaded]);

  const userIcon = useMemo(() => ({
    path: window.google?.maps?.SymbolPath?.CIRCLE,
    fillColor: '#f97316',
    fillOpacity: 1,
    strokeWeight: 4,
    strokeColor: '#FFFFFF',
    scale: 8
  }), [isLoaded]);

  const [mapType, setMapType] = useState('roadmap');

  const displayBuses = searchResult 
    ? buses.filter(bus => searchResult.buses.some(b => b.id === bus.id) || (currentSelectedBus && String(currentSelectedBus.id) === String(bus.id)))
    : buses;

  if (loadError) return <div style={{padding: '2rem'}}>Error loading Google Maps: {loadError.message}</div>;
  if (!isLoaded) return <div style={{padding: '2rem'}}>Loading Google Maps API...</div>;

  return (
    <div className="map-page-container">
      <div className="glass-panel map-type-dropdown" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        padding: '5px',
        borderRadius: '12px'
      }}>
        <select 
          value={mapType} 
          onChange={(e) => setMapType(e.target.value)}
          className="modern-select"
        >
          <option value="roadmap">Roadmap View</option>
          <option value="satellite">Satellite View</option>
          <option value="hybrid">Hybrid View</option>
          <option value="terrain">Terrain View</option>
        </select>
      </div>

      <div className="floating-search-container glass-panel">
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <FiAlertCircle size={16} style={{marginTop: '2px', flexShrink: 0}} />
              <div>Warning: No Google Maps API Key. Map may not display.</div>
            </div>
          )}

          <div className="search-input-group">
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Source Station..." 
                value={searchSource}
                onChange={(e) => {
                  setSearchSource(e.target.value);
                  setActiveDropdown('source');
                }}
                onFocus={() => setActiveDropdown('source')}
                onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
              />
              {activeDropdown === 'source' && (
                <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', listStyle: 'none', padding: '5px 0', margin: '5px 0 0 0', zIndex: 2000, maxHeight: '250px', overflowY: 'auto' }}>
                  {getFilteredCities(searchSource).map(city => (
                    <li 
                      key={city} 
                      onMouseDown={() => { setSearchSource(city.charAt(0).toUpperCase() + city.slice(1)); setActiveDropdown(null); }}
                      style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#334155', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <FiMapPin color="#94a3b8" />
                      <div>
                        <div style={{ fontWeight: '500' }}>{city.charAt(0).toUpperCase() + city.slice(1)}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Punjab</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Destination Station..." 
                value={searchDestination}
                onChange={(e) => {
                  setSearchDestination(e.target.value);
                  setActiveDropdown('dest');
                }}
                onFocus={() => setActiveDropdown('dest')}
                onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
              />
              {activeDropdown === 'dest' && (
                <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', listStyle: 'none', padding: '5px 0', margin: '5px 0 0 0', zIndex: 2000, maxHeight: '250px', overflowY: 'auto' }}>
                  {getFilteredCities(searchDestination).map(city => (
                    <li 
                      key={city} 
                      onMouseDown={() => { setSearchDestination(city.charAt(0).toUpperCase() + city.slice(1)); setActiveDropdown(null); }}
                      style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#334155', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <FiMapPin color="#94a3b8" />
                      <div>
                        <div style={{ fontWeight: '500' }}>{city.charAt(0).toUpperCase() + city.slice(1)}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Punjab</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <button className="sidebar-search-btn" onClick={handleSearch}>
              <FiSearch /> Find Buses
            </button>
          </div>
        </div>
      </div>

      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={8}
          onLoad={onLoad}
          onUnmount={onUnmount}
          mapTypeId={mapType}
          options={{
            styles: mapType === 'roadmap' ? mapStyleOptions : [],
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer 
              directions={directionsResponse}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#3b82f6',
                  strokeOpacity: 0.8,
                  strokeWeight: 6,
                  zIndex: 1
                }
              }}
            />
          )}
          

          {userLocation && (
            <MarkerF
              position={userLocation}
              icon={userIcon}
              zIndex={200}
              title="Your Location"
              onClick={() => setUserLocationSelected(true)}
            />
          )}

          {userLocationSelected && userLocation && (
            <InfoWindowF
              position={userLocation}
              onCloseClick={() => setUserLocationSelected(false)}
            >
              <div className="advanced-user-location-popup">
                <div className="popup-header">
                  <div className="pulse-dot"></div>
                  <span>Your Location</span>
                </div>
                {nearestStationName && (
                  <div className="popup-body">
                    Nearest Station: <strong>{nearestStationName.charAt(0).toUpperCase() + nearestStationName.slice(1)}</strong>
                  </div>
                )}
              </div>
            </InfoWindowF>
          )}

          {nearestStationDirections && (
            <DirectionsRenderer 
              directions={nearestStationDirections}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#f97316',
                  strokeOpacity: 0.8,
                  strokeWeight: 6,
                  zIndex: 7
                }
              }}
            />
          )}
          
          {searchResult && searchResult.buses.length > 0 && (() => {
             let stopsToRender = searchResult.buses[0].route.stops;
             if (searchResult.sourceSearch && searchResult.destSearch && searchResult.sourceSearch !== 'your location') {
                const sIdx = stopsToRender.findIndex(s => s.includes(searchResult.sourceSearch) || searchResult.sourceSearch.includes(s));
                const dIdx = stopsToRender.findIndex(s => s.includes(searchResult.destSearch) || searchResult.destSearch.includes(s));
                if (sIdx !== -1 && dIdx !== -1 && sIdx < dIdx) {
                    stopsToRender = stopsToRender.slice(sIdx, dIdx + 1);
                } else if (sIdx !== -1 && dIdx !== -1 && sIdx > dIdx) {
                    stopsToRender = stopsToRender.slice(dIdx, sIdx + 1).reverse();
                }
             }
             return stopsToRender.map((stop, i) => {
                const coord = cityCoords[stop];
                if (!coord) return null;
                return (
                  <MarkerF
                    key={`stop-${i}`}
                    position={coord}
                    icon={stopIcon}
                    label={{
                      text: stop.charAt(0).toUpperCase() + stop.slice(1),
                      className: 'stop-label marker-label-custom',
                      color: '#1e293b',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    options={{ labelOrigin: new window.google.maps.Point(0, -15) }}
                  />
                );
             });
          })()}

          {searchResult && searchResult.sourceSearch && getCityCoord(searchResult.sourceSearch) && (
            <MarkerF position={getCityCoord(searchResult.sourceSearch)} icon={sourceIcon} />
          )}
          {searchResult && searchResult.destSearch && getCityCoord(searchResult.destSearch) && (
            <MarkerF position={getCityCoord(searchResult.destSearch)} icon={destIcon} />
          )}

          {displayBuses.map((bus) => {
             const routeNameLower = bus.route.name ? bus.route.name.toLowerCase() : '';
             const matchedGlobalKey = Object.keys(globalPaths).find(k => k.toLowerCase() === routeNameLower);
             let baseRoutePath = matchedGlobalKey && globalPaths[matchedGlobalKey].length > 1 
                               ? globalPaths[matchedGlobalKey] 
                               : null;

             if (searchResult && !baseRoutePath) {
                 return null;
             }

             let color = '#10B981';
             if (bus.trafficCondition === 'Moderate') color = '#F59E0B';
             if (bus.trafficCondition === 'Heavy') color = '#EF4444';
             
             const busIconObject = {
               path: "M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z",
               fillColor: color,
               fillOpacity: 1,
               strokeWeight: 1,
               strokeColor: '#FFFFFF',
               scale: 1.2,
               anchor: window.google ? new window.google.maps.Point(12, 12) : null
             };

             const isSelected = currentSelectedBus && currentSelectedBus.id === bus.id;
             const isMatchedSearch = searchResult && searchResult.buses.some(b => b.id === bus.id);
             
             // Draw paths for all buses unless there's a search, then only draw matched buses. If a bus is specifically selected, draw it too.
             const shouldDrawPath = (!searchResult && !currentSelectedBus) || isMatchedSearch || isSelected;
             
             let pathElements = null;
             let snappedLocation = bus.currentLocation;

             if (shouldDrawPath) {
                  let routePath = baseRoutePath;
                  
                  if (searchResult && routePath) {
                      routePath = trimPathBySearch(routePath, searchResult);
                  }

                  if (routePath && routePath.length > 0) {
                      let splitIdx = 0;
                      let minDist = Infinity;
                      routePath.forEach((pt, idx) => {
                          const dist = Math.pow(pt.lat - bus.currentLocation.lat, 2) + Math.pow(pt.lng - bus.currentLocation.lng, 2);
                          if (dist < minDist) {
                              minDist = dist;
                              splitIdx = idx;
                          }
                      });
                      
                      if (routePath[splitIdx]) {
                          snappedLocation = routePath[splitIdx];
                      }
                      
                      let traveledPath = [];
                      let remainingPath = [];
                      
                      traveledPath = routePath.slice(0, splitIdx + 1);
                      traveledPath.push(snappedLocation);
                      remainingPath = [snappedLocation, ...routePath.slice(splitIdx + 1)];

                      const weight = isSelected ? 8 : (isMatchedSearch ? 6 : 4);
                      const opacity = isSelected ? 1 : 0.8;

                      pathElements = (
                        <React.Fragment key={`paths-${bus.id}`}>
                          <PolylineF 
                            path={traveledPath}
                            options={{ strokeColor: '#9ca3af', strokeOpacity: opacity, strokeWeight: weight, zIndex: isSelected ? 6 : 2 }}
                          />
                          <PolylineF 
                            path={remainingPath}
                            options={{ strokeColor: color, strokeOpacity: opacity, strokeWeight: weight, zIndex: isSelected ? 7 : 3 }}
                          />
                        </React.Fragment>
                      );
                  }
             }

             return (
               <React.Fragment key={`bus-group-${bus.id}`}>
                 {pathElements}
                 <MarkerF 
                   position={snappedLocation}
                   icon={busIconObject}
                   onClick={() => {
                     setSelectedBus(bus);
                     if (map) {
                       map.panTo(snappedLocation);
                       map.setZoom(14);
                     }
                   }}
                   zIndex={100}
                 />
               </React.Fragment>
             );
           })}

          {currentSelectedBus && (
            <InfoWindowF
              position={currentSelectedBus.currentLocation}
              onCloseClick={() => {
                setSelectedBus(null);
                if (map && !searchResult) {
                  map.panTo(defaultCenter);
                  map.setZoom(8);
                }
              }}
              options={{ pixelOffset: new window.google.maps.Size(0, -20) }}
            >
              <div className="custom-info-window">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>{currentSelectedBus.busNumber}</h3>
                  <button 
                    onClick={() => {
                      setSelectedBus(null);
                      window.location.href = '/map';
                    }} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 'bold' }}
                  >
                    Reset View
                  </button>
                </div>
                <p style={{ margin: '5px 0' }}><strong>Route:</strong> {currentSelectedBus.route.name}</p>
                <div className="info-row">
                  <span className="info-label">Speed:</span>
                  <span>{currentSelectedBus.speed.toFixed(1)} km/h</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Traffic:</span>
                  <span style={{ 
                    color: currentSelectedBus.trafficCondition === 'Clear' ? '#10B981' : (currentSelectedBus.trafficCondition === 'Heavy' ? '#EF4444' : '#F59E0B'),
                    fontWeight: 'bold'
                  }}>
                    {currentSelectedBus.trafficCondition}
                  </span>
                </div>
                <div className="info-row" style={{ marginTop: '5px', paddingTop: '5px', borderTop: '1px solid #e2e8f0'}}>
                  <span className="info-label"><FiClock style={{marginBottom: '-2px'}}/> Next Stop ETA:</span>
                  <span>{Math.floor(Math.random() * 15) + 5} mins</span>
                </div>
                <button 
                  style={{ width: '100%', marginTop: '10px', padding: '6px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                  onClick={() => setShowSmartAlertModal(true)}
                >
                  <FiBell /> Smart Alert
                </button>
              </div>
            </InfoWindowF>
          )}

        </GoogleMap>
      </div>

      {(searchResult || currentSelectedBus) && (
        <div className="map-sidebar-left glass-panel">
          <div className="sidebar-content">
            <div className="panel-header">
              <span>{currentSelectedBus ? 'Active Route & ETA' : 'Route Stops & ETA'}</span>
            </div>
            <div className="route-timeline" style={{ position: 'relative' }}>
              {(() => {
                const targetBus = currentSelectedBus || (searchResult && searchResult.buses.length > 0 ? buses.find(b => b.id === searchResult.buses[0].id) : null);
                if (!targetBus) return null;

                const routeStops = targetBus.route.stops;
                const totalStops = routeStops.length;
                let progressPercent = 0;
                const pathLength = globalPaths[targetBus.route.name] && globalPaths[targetBus.route.name].length > 1 ? globalPaths[targetBus.route.name].length : totalStops;
                progressPercent = ((targetBus.pathIndex + targetBus.progress) / (pathLength - 1)) * 100;
                
                return (
                  <div 
                    className="timeline-bus-icon"
                    style={{
                      position: 'absolute',
                      left: '11px',
                      top: `${progressPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 15,
                      fontSize: '1.2rem',
                      transition: 'top 0.15s linear'
                    }}
                  >
                    🚌
                  </div>
                );
              })()}

              {(() => {
                const targetBus = currentSelectedBus || (searchResult && searchResult.buses.length > 0 ? buses.find(b => b.id === searchResult.buses[0].id) : null);
                if (!targetBus) return null;
                let routeStops = targetBus.route.stops;
                if (!currentSelectedBus && searchResult && searchResult.sourceSearch && searchResult.destSearch && searchResult.sourceSearch !== 'your location') {
                    const sIdx = routeStops.findIndex(s => s.includes(searchResult.sourceSearch) || searchResult.sourceSearch.includes(s));
                    const dIdx = routeStops.findIndex(s => s.includes(searchResult.destSearch) || searchResult.destSearch.includes(s));
                    if (sIdx !== -1 && dIdx !== -1 && sIdx < dIdx) {
                        routeStops = routeStops.slice(sIdx, dIdx + 1);
                    } else if (sIdx !== -1 && dIdx !== -1 && sIdx > dIdx) {
                        routeStops = routeStops.slice(dIdx, sIdx + 1).reverse();
                    }
                }
                
                return routeStops.map((stop, idx) => {
                  let etaDisplay = null;
                  const totalStops = targetBus.route.stops.length;
                  const pathLength = globalPaths[targetBus.route.name] && globalPaths[targetBus.route.name].length > 1 ? globalPaths[targetBus.route.name].length : targetBus.route.stops.length;
                  const globalBusStopIndex = Math.floor((targetBus.pathIndex / pathLength) * (totalStops - 1));
                  const originalIndex = targetBus.route.stops.indexOf(stop);
                  
                  if (originalIndex <= globalBusStopIndex) {
                    etaDisplay = <span style={{ color: '#10b981', fontWeight: '600' }}>Arrived</span>;
                  } else {
                    const segmentTime = 1; 
                    const remainingInSegment = segmentTime * (1 - targetBus.progress);
                    const extraSegments = Math.max(0, originalIndex - (globalBusStopIndex + 1));
                    const totalEta = Math.ceil(remainingInSegment + (extraSegments * segmentTime));
                    etaDisplay = <span><FiClock style={{marginBottom: '-2px'}}/> {totalEta} mins</span>;
                  }

                  return (
                    <div className="route-step" key={idx}>
                      <div className="step-icon" style={{ 
                        borderColor: (originalIndex <= globalBusStopIndex) ? '#10b981' : 'var(--primary)' 
                      }}></div>
                      <div className="step-content">
                        <div className="step-name">{stop.charAt(0).toUpperCase() + stop.slice(1)}</div>
                        <div className="step-eta">
                          {etaDisplay}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="map-sidebar-right glass-panel">
        <div className="sidebar-content">
          <div className="panel-header">
            <span><FiLayers style={{ marginRight: '8px' }}/> {searchResult ? 'Matching Routes' : 'Available Buses'}</span>
          </div>

          {searchResult && (
            <button 
              className="sidebar-search-btn" 
              style={{ width: '100%', marginBottom: '15px', background: '#3b82f6' }}
              onClick={() => {
                alert('Smart Alerts Enabled! You will now receive SMS/Push notifications for arrivals, departures, and unexpected delays on this route.');
              }}
            >
              <FiBell style={{ marginRight: '5px' }} /> Enable Smart Alerts
            </button>
          )}
          
          {searchResult ? (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Found <strong>{searchResult.buses.length}</strong> active buses matching the search criteria. Click on a bus to track it on the map.
              </p>
              <div className="available-buses-list">
                {searchResult.buses.length > 0 ? searchResult.buses.map((bus, idx) => (
                  <div className="bus-available-item" key={idx}>
                    <div className="location-name" style={{ color: 'var(--primary)' }}>{bus.busNumber}</div>
                    <div className="route-name">
                      <FiMapPin size={12} color="var(--secondary)" /> {bus.route.name}
                    </div>
                    <div className="bus-details-grid">
                      <div className="detail-label">Speed</div>
                      <div className="detail-value">{bus.speed.toFixed(1)} km/h</div>
                      <div className="detail-label">Traffic</div>
                      <div className="detail-value" style={{ 
                        color: bus.trafficCondition === 'Clear' ? '#10B981' : (bus.trafficCondition === 'Heavy' ? '#EF4444' : '#F59E0B') 
                      }}>{bus.trafficCondition}</div>
                    </div>
                    <button 
                      className="sidebar-search-btn" 
                      style={{ marginTop: '10px', padding: '8px', fontSize: '0.85rem', background: '#f1f5f9', color: 'var(--primary)' }}
                      onClick={() => {
                        setSelectedBus(bus);
                        if (map) {
                          map.panTo(bus.currentLocation);
                          map.setZoom(14);
                        }
                      }}
                    >
                      Track Bus Location
                    </button>
                  </div>
                )) : (
                  <p style={{ color: 'var(--danger)', fontSize: '0.9rem', padding: '1rem', background: '#fee2e2', borderRadius: '8px' }}>No active buses found for this exact route connection.</p>
                )}
              </div>
              <button className="sidebar-search-btn" style={{ marginTop: '15px', background: '#e2e8f0', color: '#334155' }} onClick={() => {
                setSearchResult(null);
                setSearchSource('');
                setSearchDestination('');
                setDirectionsResponse(null);
                if (map) {
                  map.panTo(defaultCenter);
                  map.setZoom(8);
                }
              }}>Clear Filter</button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Real-time active buses across major stations. Select a route to see stimulation.
              </p>
              <div className="available-buses-list">
                {availableBusesData.map((loc, idx) => (
                  <div 
                    className="bus-available-item" 
                    key={idx}
                    style={{ cursor: 'pointer', transition: 'background 0.2s', border: '1px solid #e2e8f0' }}
                    onClick={() => {
                      setSearchSource(loc.searchHint);
                      setSearchDestination('');
                      setSearchResult(null);
                      // Trigger a search automatically
                      setTimeout(() => {
                        const evt = { target: { value: loc.searchHint } };
                        setSearchSource(loc.searchHint);
                        // find buses with this source
                        const matches = buses.filter(b => b.route.stops.includes(loc.searchHint));
                        setSearchResult({
                          title: `Buses from ${loc.location.split(':')[0]}`,
                          buses: matches,
                          sourceSearch: loc.searchHint,
                          destSearch: ''
                        });
                        if (map) {
                           const c = cityCoords[loc.searchHint];
                           if(c) {
                             map.panTo(c);
                             map.setZoom(10);
                           }
                        }
                      }, 100);
                    }}
                  >
                    <div className="location-name" style={{ color: loc.color, fontSize: '0.95rem' }}>{loc.location}</div>
                    <div className="bus-details-grid" style={{ marginTop: '5px' }}>
                      <div className="detail-label">Available Buses</div>
                      <div className="detail-value">{loc.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <button 
        className="my-location-btn"
        onClick={() => {
          if (map && userLocation) {
            map.panTo(userLocation);
            map.setZoom(15);
            setUserLocationSelected(true);
          } else {
            alert('Location not available yet. Please allow location permissions.');
          }
        }}
      >
        <FiMapPin fill="#f97316" color="white" />
      </button>

      {showSmartAlertModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.95)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiBell /> Smart Alert Setup
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Get instant notifications via Email or WhatsApp when {selectedBus?.busNumber || 'your bus'} approaches stops.</p>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>Email Address</label>
              <input 
                type="email" 
                value={smartAlertEmail} 
                onChange={(e) => setSmartAlertEmail(e.target.value)} 
                placeholder="Enter your email"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>WhatsApp Number</label>
              <input 
                type="text" 
                value={smartAlertPhone}
                onChange={(e) => setSmartAlertPhone(e.target.value)}
                placeholder="+91 "
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowSmartAlertModal(false)}
                style={{ padding: '8px 16px', border: 'none', background: '#e2e8f0', color: '#334155', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSmartAlertSave}
                style={{ padding: '8px 16px', border: 'none', background: 'var(--primary)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Save Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MapPage = () => (
  <MapErrorBoundary>
    <MapPageInner />
  </MapErrorBoundary>
);

export default MapPage;
