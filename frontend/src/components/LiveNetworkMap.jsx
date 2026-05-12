import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiCrosshair, FiLayers } from 'react-icons/fi';
import './LiveNetworkMap.css';

const CITIES = {
  Bathinda: { x: 150, y: 380 },
  Faridkot: { x: 280, y: 300 },
  Moga: { x: 400, y: 330 },
  Firozpur: { x: 550, y: 380 },
  Ludhiana: { x: 600, y: 220 },
  Jalandhar: { x: 300, y: 150 },
  Hoshiarpur: { x: 480, y: 80 },
  Patiala: { x: 750, y: 340 },
  Chandigarh: { x: 880, y: 180 }
};

const ROUTES = [
  { id: 'r1', color: '#ffb703', path: 'Bathinda -> Faridkot -> Moga -> Firozpur', pathData: 'M 150 380 Q 200 320 280 300 Q 350 320 400 330 Q 480 370 550 380' },
  { id: 'r2', color: '#00ffff', path: 'Jalandhar -> Ludhiana -> Chandigarh', pathData: 'M 300 150 Q 450 180 600 220 Q 750 180 880 180' },
  { id: 'r3', color: '#34d399', path: 'Ludhiana -> Patiala', pathData: 'M 600 220 Q 650 300 750 340' },
  { id: 'r4', color: '#a855f7', path: 'Hoshiarpur -> Jalandhar', pathData: 'M 480 80 Q 380 100 300 150' },
  { id: 'r5', color: '#f43f5e', path: 'Firozpur -> Patiala', pathData: 'M 550 380 Q 650 400 750 340' }
];

const LiveNetworkMap = () => {
  const [buses, setBuses] = useState([]);
  const [stats, setStats] = useState({ excellent: 6, good: 2, moderate: 1, delays: 1, offline: 0 });
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Generate mock bus simulation data
  useEffect(() => {
    const initialBuses = [
      { id: 'b1', routeId: 'r1', progress: 0.1, speed: 0.002, color: '#ffb703' },
      { id: 'b2', routeId: 'r1', progress: 0.6, speed: 0.003, color: '#ffb703' },
      { id: 'b3', routeId: 'r2', progress: 0.3, speed: 0.0015, color: '#00ffff' },
      { id: 'b4', routeId: 'r2', progress: 0.8, speed: 0.0025, color: '#00ffff' },
      { id: 'b5', routeId: 'r3', progress: 0.5, speed: 0.002, color: '#34d399' },
      { id: 'b6', routeId: 'r4', progress: 0.2, speed: 0.004, color: '#a855f7' },
      { id: 'b7', routeId: 'r5', progress: 0.7, speed: 0.001, color: '#f43f5e' }
    ];
    setBuses(initialBuses);

    const interval = setInterval(() => {
      setBuses(current => current.map(bus => {
        let newProgress = bus.progress + bus.speed;
        if (newProgress > 1) {
          newProgress = 0; // reset to start
          // randomly tweak speed
          bus.speed = (Math.random() * 0.003) + 0.001; 
        }
        return { ...bus, progress: newProgress };
      }));
      setLastUpdated(new Date().toLocaleTimeString());

      // Randomly update stats for simulation
      if (Math.random() > 0.7) {
        setStats(prev => ({
          excellent: Math.max(0, prev.excellent + (Math.random() > 0.5 ? 1 : -1)),
          good: Math.max(0, prev.good + (Math.random() > 0.5 ? 1 : -1)),
          moderate: Math.max(0, prev.moderate + (Math.random() > 0.8 ? 1 : -1)),
          delays: Math.max(0, prev.delays + (Math.random() > 0.9 ? 1 : -1)),
          offline: prev.offline
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helper to get coordinates on SVG path
  const getPointOnPath = (pathData, progress) => {
    // A simplified generic SVG path parser simulation
    // In a real scenario we might use svg-path-properties or a DOM ref to get exact coordinates
    // Here we manually interpolate a Q curve for demonstration
    // Since we know the routes are mostly Q curves, we do a basic quadratic bezier interpolation
    const parts = pathData.split(' ');
    // Very basic extraction for visual demo
    if (parts[0] === 'M' && parts[3] === 'Q') {
      const p0 = { x: parseFloat(parts[1]), y: parseFloat(parts[2]) };
      const p1 = { x: parseFloat(parts[4]), y: parseFloat(parts[5]) };
      const p2 = { x: parseFloat(parts[6]), y: parseFloat(parts[7]) };
      
      const t = progress;
      const x = Math.pow(1-t, 2)*p0.x + 2*(1-t)*t*p1.x + Math.pow(t, 2)*p2.x;
      const y = Math.pow(1-t, 2)*p0.y + 2*(1-t)*t*p1.y + Math.pow(t, 2)*p2.y;
      return { x, y };
    }
    // Fallback
    return { x: 0, y: 0 };
  };

  return (
    <div className="live-network-map-section">
      <div className="map-card-glass">
        
        <div className="map-header">
          <div>
            <h2 className="map-title">Live Network Map</h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span className="live-indicator"><div className="pulse-dot"></div> Live</span>
              <span className="map-last-updated">Last updated {lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="map-svg-container">
          <div className="map-controls">
            <button className="map-btn"><FiPlus /></button>
            <button className="map-btn"><FiMinus /></button>
            <button className="map-btn"><FiCrosshair /></button>
            <button className="map-btn"><FiLayers /></button>
          </div>

          <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
            {/* Background Grid */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" className="map-grid" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Faux Punjab Outline shadow */}
            <path d="M 100 200 C 150 100 400 50 500 100 C 600 50 800 100 900 200 C 950 300 800 450 700 450 C 500 480 200 450 100 350 Z" className="punjab-outline" />

            {/* Routes */}
            {ROUTES.map(route => (
              <g key={route.id}>
                <path 
                  d={route.pathData} 
                  className="route-path animated" 
                  stroke={route.color}
                  style={{ filter: `drop-shadow(0 0 5px ${route.color})` }}
                />
              </g>
            ))}

            {/* City Nodes */}
            {Object.entries(CITIES).map(([name, coords]) => (
              <g key={name} className="city-node">
                <circle cx={coords.x} cy={coords.y} r="5" fill="#e2e8f0" />
                <circle cx={coords.x} cy={coords.y} r="10" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />
                <text x={coords.x} y={coords.y - 15} textAnchor="middle">{name}</text>
              </g>
            ))}

            {/* Moving Buses */}
            {buses.map(bus => {
              const route = ROUTES.find(r => r.id === bus.routeId);
              if (!route) return null;
              const pos = getPointOnPath(route.pathData, bus.progress);
              return (
                <g key={bus.id} className="bus-indicator" transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="4" fill="#ffffff" className="bus-glow" stroke={bus.color} strokeWidth="2" />
                  <circle cx="0" cy="0" r="3" fill={bus.color} />
                  <circle cx="0" cy="0" r="10" fill="none" stroke={bus.color} className="bus-glow" />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="status-panel">
          <div className="status-item">
            <div className="status-header">
              <div className="status-dot" style={{ backgroundColor: '#00ffff', boxShadow: '0 0 8px #00ffff' }}></div> Excellent
            </div>
            <div className="status-count">{stats.excellent}</div>
          </div>
          <div className="status-item">
            <div className="status-header">
              <div className="status-dot" style={{ backgroundColor: '#34d399', boxShadow: '0 0 8px #34d399' }}></div> Good
            </div>
            <div className="status-count">{stats.good}</div>
          </div>
          <div className="status-item">
            <div className="status-header">
              <div className="status-dot" style={{ backgroundColor: '#ffb703', boxShadow: '0 0 8px #ffb703' }}></div> Moderate
            </div>
            <div className="status-count">{stats.moderate}</div>
          </div>
          <div className="status-item">
            <div className="status-header">
              <div className="status-dot" style={{ backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }}></div> Delays
            </div>
            <div className="status-count">{stats.delays}</div>
          </div>
          <div className="status-item">
            <div className="status-header">
              <div className="status-dot" style={{ backgroundColor: '#64748b', boxShadow: '0 0 8px #64748b' }}></div> Offline
            </div>
            <div className="status-count">{stats.offline}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(LiveNetworkMap);
