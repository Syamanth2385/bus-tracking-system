import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiSearch, FiActivity, FiArrowRight } from 'react-icons/fi';
import heroBg from '../assets/hero-bg.jpeg';
import LiveNetworkMap from '../components/LiveNetworkMap';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [cities, setCities] = useState([]);
  const [stats, setStats] = useState({ activeBuses: '40+', totalRoutes: '340+' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locRes = await axios.get('/api/buses/routes/locations');
        setCities(locRes.data);
      } catch (e) {
        console.error(e);
      }
      try {
        // Try getting stats, otherwise fallback to defaults
        const statsRes = await axios.get('/api/stats');
        setStats({
          activeBuses: statsRes.data.activeBuses || '40+',
          totalRoutes: statsRes.data.totalRoutes || '340+'
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const handleTrack = () => {
    if (from && to) {
      navigate(`/map?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`);
    } else {
      navigate('/map');
    }
  };

  const filteredFrom = cities.filter(c => c.toLowerCase().includes(from.toLowerCase()));
  const filteredTo = cities.filter(c => c.toLowerCase().includes(to.toLowerCase()));

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content-wrapper">
          <div className="hero-left">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="live-badge">
                <span className="dot"></span> {stats.activeBuses} Buses Live Right Now
              </div>
              <h1 className="hero-title-main">
               <br />
                <span className="gradient-text">Real Time Bus Tracking System</span> <br />
                
              </h1>
              <p className="hero-desc">
                Know exactly where your bus is, every second. Live GPS updates, smart route planning, and zero waiting anxiety — all in one powerful platform.
              </p>
              <button className="btn-track-live" onClick={() => navigate('/map')}>
                <FiActivity /> Track Live Buses
              </button>

              <div className="stats-row">
                <div className="stat-item">
                  <h3>{stats.activeBuses}</h3>
                  <p>Active Buses</p>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <h3>98%</h3>
                  <p>On-time Rate</p>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <h3>{stats.totalRoutes}</h3>
                  <p>Routes Covered</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="hero-right">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="search-card glass"
            >
              <div className="card-header">
                <div className="header-left">
                  <FiSearch /> <span>Find Your Route</span>
                </div>
                <div className="live-tag">Live</div>
              </div>

              <div className="search-inputs">
                <p className="input-label">ENTER LOCATIONS</p>
                <div className="input-group">
                  <FiMapPin className="pin-icon" style={{ color: '#ff4d4d' }} />
                  <input 
                    type="text" 
                    placeholder="From — Amritsar" 
                    value={from}
                    onChange={(e) => { setFrom(e.target.value); setShowFromSuggestions(true); }}
                    onFocus={() => setShowFromSuggestions(true)}
                  />
                  {showFromSuggestions && from && (
                    <div className="suggestions">
                      {filteredFrom.map(c => (
                        <div key={c} className="suggestion-item" onClick={() => { setFrom(c); setShowFromSuggestions(false); }}>
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="input-connector"></div>
                <div className="input-group">
                  <FiMapPin className="pin-icon" style={{ color: '#ff4d4d' }} />
                  <input 
                    type="text" 
                    placeholder="To — Ludhiana" 
                    value={to}
                    onChange={(e) => { setTo(e.target.value); setShowToSuggestions(true); }}
                    onFocus={() => setShowToSuggestions(true)}
                  />
                  {showToSuggestions && to && (
                    <div className="suggestions">
                      {filteredTo.map(c => (
                        <div key={c} className="suggestion-item" onClick={() => { setTo(c); setShowToSuggestions(false); }}>
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button className="btn-search-track" onClick={handleTrack}>
                <FiActivity /> Track Live Buses
              </button>
              <button className="btn-full-map" onClick={() => navigate('/map')}>
                <FiSearch /> Open Full Network Map
              </button>

              <div className="mini-chart advanced-mini-chart">
                <div className="chart-header">
                  <span className="live-pulse"></span>
                  <span>Live Tracking Network</span>
                </div>
                <div className="chart-data">
                  <div className="data-col">
                    <span className="data-val">{stats.activeBuses}</span>
                    <span className="data-lbl">Buses En Route</span>
                  </div>
                  <div className="data-col">
                    <span className="data-val">98%</span>
                    <span className="data-lbl">Accuracy</span>
                  </div>
                </div>
                <svg width="100%" height="60" viewBox="0 0 200 60" style={{ marginTop: '10px' }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00ffff" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path d="M0 50 Q 20 40, 50 45 T 100 20 T 150 35 T 200 15" fill="none" stroke="url(#lineGrad)" strokeWidth="3" className="chart-anim-path" />
                  <circle cx="50" cy="45" r="4" fill="#00ffff" className="chart-point" />
                  <circle cx="100" cy="20" r="4" fill="#00ffff" className="chart-point" />
                  <circle cx="150" cy="35" r="4" fill="#00ffff" className="chart-point" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Network View Section */}
      <LiveNetworkMap />

      {/* CTA Section */}
      <section className="cta-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="cta-overlay"></div>
        <div className="cta-card glass">
          <div className="cta-badge">
            <span className="cta-diamond">♦</span> READY TO TRACK?
          </div>
          <h2 className="cta-title">
            Stop guessing.<br />
            Start tracking.
          </h2>
          <p className="cta-subtitle">
            Join 50,000+ daily commuters who never miss their bus.
          </p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => navigate('/map')}>
              <span style={{marginRight: '8px'}}>🚌</span> Track Your Bus Now
            </button>
            <button className="btn-cta-secondary">
              <span style={{marginRight: '8px'}}>📱</span> Download App
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

