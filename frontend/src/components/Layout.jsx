import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiMessageSquare, FiCpu, FiHome, FiMap, FiInfo, FiSettings, FiActivity, FiSend, FiSearch } from 'react-icons/fi';
import { chatbotDataset } from '../data/chatbotDataset';
import busLogo from '../assets/bus-logo.jpeg';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hi, I\'m the Bus AI Assistant. How can I help you today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [dbStatus, setDbStatus] = useState('');
  const [user, setUser] = useState(null);
  
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  // Check if we are on the home page for transparent nav
  const isHome = location.pathname === '/';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        if (data.dbConnected) {
          setDbStatus(data.message);
        } else {
          setDbStatus('');
        }
      } catch (err) {
        setDbStatus('');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleSendMessage = (e, customText = null) => {
    if(e) e.preventDefault();
    const textToSend = customText || chatInput;
    if(!textToSend.trim()) return;

    const userMessage = { type: 'user', text: textToSend, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const currentMsgs = [...chatMessages, userMessage];
    setChatMessages(currentMsgs);
    const query = textToSend.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    // Simulate bot thinking/typing
    setTimeout(() => {
      let botReply = "I'm sorry, I couldn't find specific information about that. You can try asking about bus routes, timings, women's free travel, or ISBT locations in Punjab.";
      
      let bestMatchScore = 0;
      let bestMatchResponse = null;

      chatbotDataset.forEach(entry => {
        let score = 0;
        entry.keywords.forEach(keyword => {
          const lowerK = keyword.toLowerCase();
          if (query.includes(lowerK)) {
            score += lowerK.length; // Weight by keyword length for better precision
          }
        });
        
        if (score > bestMatchScore) {
          bestMatchScore = score;
          bestMatchResponse = entry.response;
        }
      });

      if (bestMatchResponse) {
        botReply = bestMatchResponse;
      }

      setChatMessages(prev => [...prev, { type: 'bot', text: botReply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1200);
  };

  const quickReplies = ["Chandigarh to Amritsar", "Women Free Travel", "Student Pass", "Track Bus"];

  return (
    <div className="layout-container">
      {/* Top Navigation */}
      <nav className={`top-nav ${!isHome || isScrolled ? 'solid-nav' : ''}`}>
        <div className="nav-left">
          <button className="hamburger-btn" onClick={toggleSidebar}>
            <FiMenu />
          </button>
          <img src={busLogo} alt="Bus Logo" loading="lazy" style={{ height: '40px', width: 'auto' }} />
          <Link to="/" className="logo">
            <span style={{ color: 'var(--primary)', fontSize: '1.8rem' }}>Bus</span>
            &nbsp;Navigator
          </Link>
        </div>
        <div className="nav-right">
          {!user ? (
            <>
              <Link to="/login" className="nav-btn-glass">Login</Link>
              <Link to="/signup" className="nav-btn-glass">Sign Up</Link>
            </>
          ) : (
            <Link to="/profile" className="user-profile-nav">
              <img src={user.profilePicture || user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Profile" className="nav-profile-img" loading="lazy" />
              <span className="nav-username">{user.name || 'User'}</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -320 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="sidebar"
          >
            <div className="sidebar-header">
              <button className="close-btn" onClick={toggleSidebar}>
                <FiX />
              </button>
            </div>
            <div className="sidebar-links">
              <Link to="/" className="sidebar-link" onClick={toggleSidebar}><FiHome /> Home</Link>
              <Link to="/map" className="sidebar-link" onClick={toggleSidebar}><FiMap /> Live Map</Link>
              <Link to="/buses" className="sidebar-link" onClick={toggleSidebar}><FiSearch /> Bus Search</Link>
              <Link to="/reminders" className="sidebar-link" onClick={toggleSidebar}><FiBell /> Alerts & Reminders</Link>
              <Link to="/about" className="sidebar-link" onClick={toggleSidebar}><FiInfo /> About Us</Link>
            </div>
            
            <div className="sidebar-section-divider"></div>
            <div className="sidebar-section-title">Management</div>
            
            <div className="sidebar-links">
              <Link to="/dashboard" className="sidebar-link admin-sidebar-link" onClick={toggleSidebar}><FiActivity /> Analytics Dashboard</Link>
              <Link to="/admin" className="sidebar-link admin-sidebar-link" onClick={toggleSidebar}><FiSettings /> Admin Panel</Link>
            </div>
            
            <div style={{ marginTop: 'auto', padding: '1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', textAlign: 'center' }}>
              &copy; {new Date().getFullYear()} PunjabBus Track<br/>v2.0 Advanced Edition
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Floating Buttons */}
      {location.pathname !== '/map' && (
        <Link to="/feedback" className="floating-btn" title="Give Feedback">
          <FiMessageSquare />
        </Link>
      )}
      
      <button className="chatbot-btn" onClick={toggleChat} title="Ask AI">
        <FiCpu />
      </button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="chatbot-window"
          >
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCpu /> AI Assistant
              </div>
              <button className="chat-close" onClick={toggleChat}><FiX /></button>
            </div>
            <div className="chat-body" id="chat-body">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-message-wrapper ${msg.type === 'bot' ? 'bot-wrapper' : 'user-wrapper'}`}>
                  <div className={`chat-message ${msg.type === 'bot' ? 'bot-msg' : 'user-msg'}`}>
                    {msg.text}
                  </div>
                  <div className="chat-timestamp">{msg.timestamp}</div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-message-wrapper bot-wrapper">
                  <div className="chat-message bot-msg typing-indicator">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                </div>
              )}
            </div>
            <div className="quick-replies">
              {quickReplies.map((reply, idx) => (
                <button key={idx} className="quick-reply-btn" onClick={() => handleSendMessage(null, reply)}>
                  {reply}
                </button>
              ))}
            </div>
            <form className="chat-input" onSubmit={(e) => handleSendMessage(e)}>
              <input 
                type="text" 
                placeholder="Ask something..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit"><FiSend /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple mock for FiBell if not imported properly
const FiBell = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);

export default Layout;
