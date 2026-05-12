import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiAlertCircle, FiLock, FiLogOut, FiX, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import './Auth.css';
import './Pages.css';
import { useBusData } from '../context/BusContext';

const Admin = () => {
  const { buses: activeBuses, globalPaths } = useBusData();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard State
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    busNumber: '', capacity: 40, type: 'AC', driverName: '', status: 'Active', routeId: ''
  });

  useEffect(() => {
    // Fetch data directly since App.jsx handles authorization
    const token = localStorage.getItem('token');
    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token) => {
    setLoading(true);
    try {
      // Fetch buses
      const resBuses = await axios.get('/api/buses');
      setBuses(resBuses.data);
      
      // Fetch routes to populate dropdown
      const resRoutes = await axios.get('/api/buses/routes');
      const uniqueRoutes = resRoutes.data;
      
      setRoutes(uniqueRoutes);
      if (uniqueRoutes.length > 0) {
        setFormData(prev => ({ ...prev, routeId: prev.routeId || uniqueRoutes[0]._id }));
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setDashboardError('Failed to fetch data.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      busNumber: '', capacity: 40, type: 'AC', driverName: '', status: 'Active', 
      routeId: routes.length > 0 ? routes[0]._id : ''
    });
    setShowModal(true);
  };

  const openEditModal = (bus) => {
    setIsEditing(true);
    setEditingId(bus._id);
    setFormData({
      busNumber: bus.busNumber,
      capacity: bus.capacity,
      type: bus.type,
      driverName: bus.driverName || '',
      status: bus.status || 'Active',
      routeId: bus.route ? bus.route._id : (routes.length > 0 ? routes[0]._id : '')
    });
    setShowModal(true);
  };

  const handleSaveBus = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (isEditing) {
        await axios.put(`/api/buses/${editingId}`, formData, config);
      } else {
        await axios.post('/api/buses', formData, config);
      }
      
      setShowModal(false);
      fetchDashboardData(token);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save bus. Ensure route is selected and data is valid.');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to permanently delete this bus?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/buses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBuses(buses.filter(bus => bus._id !== id));
      } catch (err) {
        alert('Failed to delete bus. Admin token may be expired.');
      }
    }
  };

  return (
    <div className="admin-dashboard-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="page-title" style={{ margin: 0, color: 'white' }}>Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-outline btn-sm" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
            <FiLogOut /> Logout
          </button>
        </div>

        <div className="admin-card">
          <div className="admin-header">
            <h3>Manage Fleet & Buses</h3>
            <button className="btn-primary btn-sm" onClick={openAddModal}>
              <FiPlus /> Add New Bus
            </button>
          </div>
          
          {dashboardError && <div className="auth-error">{dashboardError}</div>}
          
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading secure database...</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Bus Number</th>
                    <th>Route</th>
                    <th>Type / Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus._id}>
                      <td style={{ fontWeight: 700, color: '#1e293b' }}>{bus.busNumber}</td>
                      <td style={{ color: '#475569', fontWeight: 500 }}>
                        <div>{bus.route ? bus.route.routeName : 'Unassigned'}</div>
                        {bus.route && bus.route.stops && bus.route.stops.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                            Stops: {bus.route.stops.map(s => s.stopName || s).join(' • ')}
                          </div>
                        )}
                      </td>
                      <td style={{ color: '#1e293b' }}>{bus.type} • {bus.capacity} seats</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '100px', 
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: bus.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: bus.status === 'Active' ? '#10b981' : '#ef4444'
                        }}>
                          {bus.status || 'Active'}
                        </span>
                      </td>
                      <td className="action-btns">
                        <button className="btn-outline btn-sm" onClick={() => openEditModal(bus)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button 
                          className="btn-outline btn-sm" 
                          style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
                          onClick={() => handleDelete(bus._id)}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {buses.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        No buses found in the database. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div 
              className="auth-card"
              style={{ margin: '2rem', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#1e293b', margin: 0 }}>{isEditing ? 'Edit Bus details' : 'Add New Bus'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}><FiX /></button>
              </div>
              
              <form className="auth-form" onSubmit={handleSaveBus}>
                <div className="form-group">
                  <label>Bus Number</label>
                  <input type="text" value={formData.busNumber} onChange={e => setFormData({...formData, busNumber: e.target.value})} required placeholder="e.g. PB-10-1234" />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Capacity</label>
                    <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required min="10" max="100" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#f8fafc', fontSize: '1.05rem', outline: 'none' }}>
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                      <option value="Sleeper">Sleeper</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Driver Name</label>
                  <input type="text" value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} placeholder="Optional" />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#f8fafc', fontSize: '1.05rem', outline: 'none' }}>
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Assign Route</label>
                  <select value={formData.routeId} onChange={e => setFormData({...formData, routeId: e.target.value})} required style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#f8fafc', fontSize: '1.05rem', outline: 'none' }}>
                    <option value="" disabled>Select a route</option>
                    {routes.map(r => (
                      <option key={r._id} value={r._id}>{r.routeName}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                  <FiCheck /> {isEditing ? 'Update Bus' : 'Save Bus'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
