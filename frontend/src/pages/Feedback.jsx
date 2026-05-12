import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import axios from 'axios';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('General Feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/feedback', {
        category,
        message: feedback
      });
      alert('Thank you for your feedback!');
      navigate('/');
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0f172a',
      backgroundImage: `
        radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
        radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
        radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
      `,
      backgroundAttachment: 'fixed',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            color: '#94a3b8',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <FiX size={24} />
        </button>
        <FiMessageSquare style={{ fontSize: '3rem', color: '#00a884', marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'rgba(20, 99, 226, 0.68)', marginBottom: '1rem', backgroundImage: 'linear-gradient(to right, #206be3cb, #1662deff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }}>We Value Your Feedback</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Help us improve the PunjabBus Track experience.</p>

        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '2.5rem',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          textAlign: 'left'
        }}>
          <div>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ 
                width: '100%',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '1rem',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'auto'
              }}
            >
              <option>General Feedback</option>
              <option>Report a Bug</option>
              <option>Suggest a Feature</option>
              <option>Bus Data Issue</option>
            </select>
          </div>
          <div>
            <textarea 
              placeholder="Tell us what's on your mind..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              rows="4"
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '1rem',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical'
              }}
            ></textarea>
          </div>
          <button type="submit" disabled={isSubmitting} style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            background: '#00a884',
            color: 'white',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 14px rgba(0, 168, 132, 0.3)',
            marginTop: '0.5rem'
          }}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Feedback;
