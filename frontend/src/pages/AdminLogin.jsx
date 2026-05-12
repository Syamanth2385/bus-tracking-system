import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiLock, FiShield } from 'react-icons/fi';
import './Auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.role !== 'admin') {
        setError('Access Denied: You are not authorized as an admin.');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setLoading(false);
      navigate('/admin');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.response?.data?.msg || 'Authentication failed. Invalid credentials.');
    }
  };

  return (
    <div className="auth-container admin-auth-bg">
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle admin-particle"></div>
        ))}
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="auth-card admin-auth-card"
      >
        <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#ff4d4d', fontSize: '3rem' }}>
            <FiShield />
          </div>
          <h1 className="auth-title" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', WebkitBackgroundClip: 'text' }}>Admin Portal</h1>
          <p className="auth-subtitle" style={{ color: '#ef4444', fontWeight: 'bold' }}>Restricted Access Area</p>
        </div>
        
        {error && <div className="auth-error" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' }}>{error}</div>}

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group admin-form-group">
            <label style={{ color: '#fca5a5' }}>Admin Email</label>
            <input 
              type="email" 
              name="email"
              value={email}
              onChange={onChange}
              placeholder="admin@example.com" 
              required 
            />
          </div>
          <div className="form-group admin-form-group">
            <label style={{ color: '#fca5a5' }}>Security Key / Password</label>
            <input 
              type="password" 
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter secure password" 
              required 
            />
          </div>
          <button type="submit" className="btn-primary auth-btn admin-btn" disabled={loading}>
            {loading ? 'Authenticating...' : <><FiLock style={{marginRight: '8px'}}/> Secure Login</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
