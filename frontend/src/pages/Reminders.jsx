import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMessageCircle, FiSmartphone, FiBell, FiAlertTriangle, FiTrash2, FiSave, FiUser } from 'react-icons/fi';
import './Reminders.css';

const Reminders = () => {
  const [channels, setChannels] = useState({
    email: 'user@example.com',
    whatsapp: '+91 9876543210',
    sms: '+91 9876543210'
  });

  const [toggles, setToggles] = useState({
    emailUpdates: true,
    whatsappUpdates: false,
    smsAlerts: true,
    pushNotifications: true,
    emergencyAlerts: true
  });

  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, bus: 'PB02A1234', route: 'Amritsar → Chandigarh', type: 'Delay', status: 'Active', methods: ['Email', 'WhatsApp'] },
    { id: 2, bus: 'PB08C9988', route: 'Jalandhar → Ludhiana', type: 'Route Change', status: 'Active', methods: ['SMS'] },
    { id: 3, bus: 'PB10F4321', route: 'Ludhiana → Patiala', type: 'Emergency', status: 'Critical', methods: ['All'] }
  ]);

  useEffect(() => {
    // Simulate real-time alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const types = ['Delay', 'Traffic', 'Weather Disruption', 'Offline'];
        const methods = [['Email'], ['SMS'], ['WhatsApp', 'Push'], ['All']];
        const newAlert = {
          id: Date.now(),
          bus: `PB${Math.floor(Math.random()*90 + 10)}X${Math.floor(Math.random()*9000 + 1000)}`,
          route: 'Random Route',
          type: types[Math.floor(Math.random() * types.length)],
          status: 'New',
          methods: methods[Math.floor(Math.random() * methods.length)]
        };
        setActiveAlerts(prev => [newAlert, ...prev].slice(0, 5)); // Keep latest 5
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const removeAlert = (id) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="reminders-container">
      {/* Background Particles */}
      <div className="reminders-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="r-particle"></div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="reminders-content"
      >
        <div className="reminders-header">
          <h1 className="reminders-title"><FiBell /> Alert & Notification Dashboard</h1>
          <p className="reminders-subtitle">Manage your real-time tracking alerts and notification preferences</p>
        </div>

        <div className="reminders-grid">
          {/* LEFT PANEL */}
          <div className="r-panel r-left-panel glass-panel">
            <h2 className="panel-title">Notification Channels</h2>
            
            <div className="channel-inputs">
              <div className="r-input-group">
                <FiUser className="r-icon" />
                <input 
                  type="email" 
                  value={channels.email} 
                  onChange={(e) => setChannels({...channels, email: e.target.value})} 
                  placeholder="Email Address" 
                />
              </div>
              <div className="r-input-group">
                <FiMessageCircle className="r-icon" />
                <input 
                  type="tel" 
                  value={channels.whatsapp} 
                  onChange={(e) => setChannels({...channels, whatsapp: e.target.value})} 
                  placeholder="WhatsApp Number" 
                />
              </div>
              <div className="r-input-group">
                <FiSmartphone className="r-icon" />
                <input 
                  type="tel" 
                  value={channels.sms} 
                  onChange={(e) => setChannels({...channels, sms: e.target.value})} 
                  placeholder="SMS Number" 
                />
              </div>
            </div>

            <h2 className="panel-title" style={{ marginTop: '2rem' }}>Preferences</h2>
            <div className="toggles-list">
              
              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Email Notifications</h3>
                  <p>Receive ETA updates and route changes.</p>
                </div>
                <div className={`r-toggle ${toggles.emailUpdates ? 'active' : ''}`} onClick={() => handleToggle('emailUpdates')}>
                  <div className="r-toggle-circle"></div>
                </div>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>WhatsApp Updates</h3>
                  <p>Receive live tracking links instantly.</p>
                </div>
                <div className={`r-toggle ${toggles.whatsappUpdates ? 'active' : ''}`} onClick={() => handleToggle('whatsappUpdates')}>
                  <div className="r-toggle-circle"></div>
                </div>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>SMS Alerts</h3>
                  <p>Get text messages for delays.</p>
                </div>
                <div className={`r-toggle ${toggles.smsAlerts ? 'active' : ''}`} onClick={() => handleToggle('smsAlerts')}>
                  <div className="r-toggle-circle"></div>
                </div>
              </div>

              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Push Notifications</h3>
                  <p>Realtime bus movement updates.</p>
                </div>
                <div className={`r-toggle ${toggles.pushNotifications ? 'active' : ''}`} onClick={() => handleToggle('pushNotifications')}>
                  <div className="r-toggle-circle"></div>
                </div>
              </div>

              <div className="toggle-item emergency-item">
                <div className="toggle-info">
                  <h3>Emergency Alerts</h3>
                  <p>Receive urgent transport notifications.</p>
                </div>
                <div className={`r-toggle ${toggles.emergencyAlerts ? 'active' : ''}`} onClick={() => handleToggle('emergencyAlerts')}>
                  <div className="r-toggle-circle"></div>
                </div>
              </div>

            </div>

            <button className="r-btn-save">
              <FiSave style={{ marginRight: '8px' }} /> Save Preferences
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="r-panel r-right-panel glass-panel">
            <div className="panel-header-flex">
              <h2 className="panel-title">Active Bus Alerts</h2>
              <span className="live-badge-glow"><span className="pulse-dot"></span> Live</span>
            </div>

            <div className="alerts-list">
              {activeAlerts.map(alert => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={alert.id} 
                  className={`alert-card ${alert.status === 'Critical' ? 'critical-alert' : ''}`}
                >
                  <div className="alert-card-header">
                    <div className="alert-bus-info">
                      <h3>{alert.bus}</h3>
                      <p>{alert.route}</p>
                    </div>
                    <button className="btn-delete-alert" onClick={() => removeAlert(alert.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                  
                  <div className="alert-card-body">
                    <div className="alert-type">
                      <FiAlertTriangle style={{ marginRight: '6px' }} /> {alert.type}
                    </div>
                    <div className="alert-status-badge">{alert.status}</div>
                  </div>

                  <div className="alert-methods">
                    <span>Notified via:</span>
                    <div className="method-badges">
                      {alert.methods.map(m => (
                        <span key={m} className="method-badge">{m}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {activeAlerts.length === 0 && (
                <div className="no-alerts">
                  <FiBell size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p>No active alerts at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reminders;
