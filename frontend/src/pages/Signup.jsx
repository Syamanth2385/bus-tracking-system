import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, phone } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/register', { name, email, password, phone });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setLoading(false);
      setSuccess('Account created successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await axios.post('/api/auth/google', {
          access_token: tokenResponse.access_token,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        window.location.href = '/';
      } catch (err) {
        setError('Google Sign-Up failed');
        setLoading(false);
      }
    },
    onError: () => setError('Google Sign-Up failed')
  });

  const handleOAuthLogin = (provider) => {
    if (provider === 'Google') {
      loginWithGoogle();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      navigate(`/auth/callback?code=mock_${provider.toLowerCase()}_code&provider=${provider.toLowerCase()}`);
    }, 800);
  };

  return (
    <div className="auth-container">
      {/* Floating particles background */}
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Bus Track today</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-error" style={{ backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #34d399' }}>{success}</div>}

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter your full name" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Phone Number (Optional)</label>
            <input 
              type="tel" 
              name="phone"
              value={phone}
              onChange={onChange}
              placeholder="Enter your phone number" 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Create a password" 
              minLength="6"
              required 
            />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="oauth-separator">
          <span>Or sign up with</span>
        </div>
        <div className="oauth-buttons">
          <button type="button" className="oauth-btn google-btn" onClick={() => loginWithGoogle()}>
            <FcGoogle size={20} /> Google
          </button>
          <button type="button" className="oauth-btn github-btn" onClick={() => handleOAuthLogin('GitHub')}>
            <FaGithub size={20} /> GitHub
          </button>
        </div>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Log In</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
