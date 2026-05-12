import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const provider = urlParams.get('provider') || (location.pathname.includes('github') ? 'github' : 'google');

      if (code) {
        try {
          // Send the code to backend
          const res = await axios.post('/api/auth/oauth-callback', { code, provider });
          
          if (res.data && res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            
            // Redirect to home and reload to apply auth state
            window.location.href = '/';
          } else {
            navigate('/login?error=auth_failed');
          }
        } catch (error) {
          console.error("OAuth callback error:", error);
          navigate('/login?error=auth_failed');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="auth-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
      <h2 style={{ color: 'white', zIndex: 10, textShadow: '0 0 10px rgba(0,255,255,0.8)' }}>
        Authenticating...
      </h2>
      <div style={{ 
        width: '50px', height: '50px', 
        border: '4px solid rgba(0,255,255,0.2)', 
        borderTopColor: '#00ffff', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite',
        marginTop: '20px',
        zIndex: 10
      }}></div>
    </div>
  );
};

export default AuthCallback;
