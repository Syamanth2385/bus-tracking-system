import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiEdit, FiKey, FiX } from 'react-icons/fi';
import axios from 'axios';
import './Auth.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setEditData({ name: res.data.name, email: res.data.email });
        setLoading(false);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/');
    window.location.reload(); // To force layout update
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/auth/profile', editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, name: res.data.name, email: res.data.email });
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) {
    return <div className="auth-container" style={{ alignItems: 'center', justifyContent: 'center' }}>Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="profile-card"
      >
        <div className="profile-header-bg"></div>
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" loading="lazy" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <FiUser />
            )}
          </div>
        </div>
        
        <div className="profile-info">
          {message && <div style={{ color: '#34d399', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

          {!isEditing && (
            <>
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Account Type</span>
                  <span className="detail-value" style={{ textTransform: 'capitalize', color: 'var(--primary)' }}>{user.role} Account</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Account Created</span>
                  <span className="detail-value">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Recent Login</span>
                  <span className="detail-value">{user.lastLoginTime ? new Date(user.lastLoginTime).toLocaleString() : 'Just now'}</span>
                </div>
                {user.provider !== 'local' && (
                  <div className="detail-row">
                    <span className="detail-label">Login Provider</span>
                    <span className="detail-value" style={{ textTransform: 'capitalize' }}>{user.provider}</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-outline" onClick={() => setIsEditing(true)}>
                  <FiEdit style={{ marginRight: '8px' }} /> Edit Profile
                </button>
                <Link to="/reminders" className="btn-outline">
                  <FiSettings style={{ marginRight: '8px' }} /> Settings
                </Link>
                <button className="btn-outline" style={{ color: '#ef4444', borderColor: '#fee2e2' }} onClick={handleLogout}>
                  <FiLogOut style={{ marginRight: '8px' }} /> Logout
                </button>
              </div>
            </>
          )}

          {isEditing && (
            <form onSubmit={handleEditSubmit} className="glass-form-container" style={{ textAlign: 'left' }}>
              <h2>
                Edit Profile
                <FiX style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setIsEditing(false)} />
              </h2>
              <div className="input-group form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={editData.name} 
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={editData.email} 
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  required 
                />
              </div>
              {user.provider === 'local' && (
                <>
                  <div className="input-group form-group" style={{ marginTop: '1.5rem' }}>
                    <label>Old Password (Optional)</label>
                    <input 
                      type="password" 
                      value={editData.oldPassword || ''} 
                      onChange={(e) => setEditData({...editData, oldPassword: e.target.value})}
                    />
                  </div>
                  <div className="input-group form-group">
                    <label>New Password (Optional)</label>
                    <input 
                      type="password" 
                      value={editData.newPassword || ''} 
                      onChange={(e) => setEditData({...editData, newPassword: e.target.value})}
                    />
                  </div>
                </>
              )}
              <button type="submit" className="btn-primary">Save Changes</button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
