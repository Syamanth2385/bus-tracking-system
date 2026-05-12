import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';
import './Auth.css';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container admin-auth-bg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
        style={{ textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.5)', boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)' }}
      >
        <div style={{ color: '#ef4444', fontSize: '4rem', marginBottom: '1rem' }}>
          <FiAlertTriangle />
        </div>
        <h1 style={{ color: '#f87171', fontSize: '2rem', marginBottom: '1rem' }}>Access Denied</h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Warning: You do not have the required administrative privileges to view this section. 
          Unauthorized access attempts are monitored and recorded.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn-primary" style={{ background: '#3b82f6' }} onClick={() => navigate('/')}>
            <FiHome style={{ marginRight: '8px' }} /> Return to Home
          </button>
          <button className="btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => navigate('/admin-login')}>
            Admin Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
