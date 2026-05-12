import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiMapPin, FiSearch, FiClock, FiActivity, FiMap } from 'react-icons/fi';
import { FaBusAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './BusPage.css';
import { useBusData } from '../context/BusContext';

const BusPage = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [locations, setLocations] = useState([]);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();
  
  const { buses: globalBuses } = useBusData();

  useEffect(() => {
    // Fetch unique locations for auto-suggestions
    const fetchLocations = async () => {
      try {
        const res = await axios.get('/api/buses/routes/locations');
        setLocations(res.data);
      } catch (err) {
        console.error('Failed to load locations', err);
      }
    };
    fetchLocations();
  }, []);

  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSource(value);
    setHasSearched(false);
    if (value.length > 0) {
      setSourceSuggestions(locations.filter(loc => loc.toLowerCase().includes(value.toLowerCase())));
    } else {
      setSourceSuggestions([]);
    }
  };

  const handleDestChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setHasSearched(false);
    if (value.length > 0) {
      setDestSuggestions(locations.filter(loc => loc.toLowerCase().includes(value.toLowerCase())));
    } else {
      setDestSuggestions([]);
    }
  };

  const selectSource = (loc) => {
    setSource(loc);
    setSourceSuggestions([]);
    setHasSearched(false);
  };

  const selectDest = (loc) => {
    setDestination(loc);
    setDestSuggestions([]);
    setHasSearched(false);
  };

  const executeSearch = () => {
    setLoading(true);
    setError('');
    
    // Filter from global context buses
    const matches = globalBuses.filter(bus => {
      const stops = bus.route?.stops || [];
      const sMatch = source ? stops.some(st => st.toLowerCase().includes(source.toLowerCase())) : true;
      const dMatch = destination ? stops.some(st => st.toLowerCase().includes(destination.toLowerCase())) : true;
      
      // If both source and dest exist, verify source comes before dest
      if (source && destination && sMatch && dMatch) {
         const sIdx = stops.findIndex(st => st.toLowerCase().includes(source.toLowerCase()));
         const dIdx = stops.findIndex(st => st.toLowerCase().includes(destination.toLowerCase()));
         if (sIdx > dIdx && sIdx !== -1 && dIdx !== -1) {
            // Found them but in wrong order (e.g. searching Amritsar to Jalandhar but route is Jalandhar to Amritsar)
            // Still returning true to match original backend search which was broad, but we could be strict.
         }
      }
      
      return sMatch && dMatch;
    });
    
    setBuses(matches);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    executeSearch();
  };

  // Auto update search results as global buses update
  useEffect(() => {
    if (hasSearched) {
      executeSearch();
    }
  }, [globalBuses]);

  return (
    <div className="buspage-container">
      <div className="buspage-bg"></div>
      
      <div className="buspage-content">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="search-header glass-panel"
        >
          <h1>Find Your Bus</h1>
          <p>Real-time tracking across Punjab</p>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-group">
              <FiMapPin className="input-icon" />
              <input 
                type="text" 
                placeholder="Source City" 
                value={source} 
                onChange={handleSourceChange}
              />
              {sourceSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {sourceSuggestions.map(s => (
                    <li key={s} onClick={() => selectSource(s)}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="input-group">
              <FiMapPin className="input-icon" />
              <input 
                type="text" 
                placeholder="Destination City" 
                value={destination} 
                onChange={handleDestChange}
              />
              {destSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {destSuggestions.map(s => (
                    <li key={s} onClick={() => selectDest(s)}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
            
            <button type="submit" className="search-btn">
              <FiSearch /> Search Buses
            </button>
          </form>
        </motion.div>

        {error && <div className="error-banner">{error}</div>}

        <div className="buses-grid">
          {loading ? (
            <div className="loading-spinner">Searching buses...</div>
          ) : hasSearched && buses.length > 0 ? (
            buses.map((location) => (
              <motion.div 
                key={location.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bus-card glass-panel"
              >
                <div className="card-header">
                  <div className="bus-id">
                    <FaBusAlt /> {location.bus?.busNumber || location.busNumber || 'Unknown'}
                  </div>
                  <span className={`status-badge ${location.bus?.status === 'Active' || !location.bus?.status ? 'active' : 'inactive'}`}>
                    {location.bus?.status || 'Active'}
                  </span>
                </div>
                
                <div className="route-details">
                  <div className="route-name">{location.fullRoute?.routeName || location.route?.name || 'Unassigned'}</div>
                  <div className="stops-list">
                    <strong>Stops: </strong> 
                    {location.fullRoute?.stops ? location.fullRoute.stops.map(s => s.stopName).join(' • ') : location.route?.stops?.join(' • ')}
                  </div>
                </div>
                
                <div className="bus-stats">
                  <div className="stat">
                    <FiActivity className="stat-icon" />
                    <span>Type: {location.bus?.type || 'AC'} • {location.bus?.capacity || 40} seats</span>
                  </div>
                  <div className="stat">
                    <FiMapPin className="stat-icon" />
                    <span>Lat: {location.currentLocation?.lat?.toFixed(4) || 'N/A'}, Lng: {location.currentLocation?.lng?.toFixed(4) || 'N/A'}</span>
                  </div>
                  <div className="stat">
                    <FiClock className="stat-icon" />
                    <span>Last Updated: {location.updatedAt ? new Date(location.updatedAt).toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
                  </div>
                </div>

                <button 
                  className="track-btn" 
                  onClick={() => {
                    const stops = location.fullRoute?.stops || location.route?.stops || [];
                    const orig = source || location.fullRoute?.origin || location.route?.origin || (stops.length > 0 ? (stops[0].stopName || stops[0]) : '');
                    const dest = destination || location.fullRoute?.destination || location.route?.destination || (stops.length > 1 ? (stops[stops.length - 1].stopName || stops[stops.length - 1]) : '');
                    navigate(`/map?origin=${orig}&destination=${dest}&busId=${location.id}`);
                  }}
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FiMap /> Track Bus Route
                </button>
              </motion.div>
            ))
          ) : (
            hasSearched && !loading && (
              <div className="no-results glass-panel">
                <h3>No buses found</h3>
                <p>Try adjusting your source or destination to find available routes.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BusPage;
