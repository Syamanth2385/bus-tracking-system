import React from 'react';
import { motion } from 'framer-motion';
import { FiMap, FiActivity, FiClock, FiBell, FiUsers, FiTrendingUp, FiCloudRain, FiBarChart2, FiSend, FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import './About.css';

const TEAM_MEMBERS = [
  { name: 'Mahesh', role: 'Frontend Developer', desc: 'React & UI/UX Expert' },
  { name: 'Syamanth', role: 'Backend Developer', desc: 'Node.js & Express Architecture' },
  { name: 'Jayanth Reddy', role: 'Database Manager', desc: 'MongoDB Atlas Specialist' },
  { name: 'Harshavardhan', role: 'UI/UX Designer', desc: 'Glassmorphism & Advanced CSS' },
  { name: 'Nishith', role: 'API Developer', desc: 'REST & WebSocket Integration' },
  { name: 'Balaji', role: 'Project Coordinator', desc: 'Agile Management & QA' },
];

const FEATURES = [
  { title: 'Realtime Bus Tracking', icon: <FiMap /> },
  { title: 'Route Optimization', icon: <FiActivity /> },
  { title: 'Live ETA Calculation', icon: <FiClock /> },
  { title: 'Traffic Monitoring', icon: <FiTrendingUp /> },
  { title: 'Passenger Insights', icon: <FiUsers /> },
  { title: 'Smart Alerts', icon: <FiBell /> },
  { title: 'Weather Notifications', icon: <FiCloudRain /> },
  { title: 'Revenue Analytics', icon: <FiBarChart2 /> },
];

const About = () => {
  return (
    <div className="about-page-container">
      {/* Background Effects */}
      <div className="about-particles">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="about-particle"></div>
        ))}
      </div>

      <div className="about-content-wrapper">
        
        {/* 1. HERO SECTION */}
        <section className="about-hero-section">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="about-hero-card about-glass-card"
          >
            <h1 className="about-title-glow">Real-Time Bus Tracking System</h1>
            <h2 className="about-subtitle">Smart Public Transportation Monitoring & Analytics Platform</h2>
            <p className="about-desc">
              A modern intelligent transport system that provides realtime bus tracking, route analytics, ETA prediction, passenger monitoring, and smart alerts using modern web technologies.
            </p>
            <div className="hero-illustration">
              <div className="bus-illustration-circle">
                <FiMap size={60} color="#00ffff" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. PROJECT OVERVIEW SECTION */}
        <section className="about-section">
          <h2 className="section-heading">Project Overview</h2>
          <div className="overview-grid">
            <motion.div whileHover={{ y: -5 }} className="overview-card about-glass-card">
              <FiMap className="card-icon" />
              <h3>Live Bus Tracking</h3>
              <p>GPS integration for millisecond accuracy.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="overview-card about-glass-card">
              <FiActivity className="card-icon" />
              <h3>Smart Route Analytics</h3>
              <p>AI-driven path optimization.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="overview-card about-glass-card">
              <FiClock className="card-icon" />
              <h3>ETA Prediction</h3>
              <p>Dynamic traffic-based timing.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="overview-card about-glass-card">
              <FiBell className="card-icon" />
              <h3>Notification Alerts</h3>
              <p>Instant push and SMS updates.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="overview-card about-glass-card">
              <FiUsers className="card-icon" />
              <h3>Passenger Monitoring</h3>
              <p>Live capacity tracking.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="overview-card about-glass-card">
              <FiBarChart2 className="card-icon" />
              <h3>Fleet Management</h3>
              <p>Comprehensive admin control.</p>
            </motion.div>
          </div>
        </section>

        {/* 3. TECHNOLOGY STACK SECTION */}
        <section className="about-section">
          <h2 className="section-heading">Technology Stack</h2>
          <div className="tech-stack-container about-glass-card">
            <div className="tech-category">
              <h3>Frontend</h3>
              <ul className="tech-list">
                <li>React.js</li>
                <li>Vite</li>
                <li>React Router</li>
                <li>Axios</li>
                <li>Framer Motion</li>
              </ul>
            </div>
            <div className="tech-category">
              <h3>Backend</h3>
              <ul className="tech-list">
                <li>Node.js</li>
                <li>Express.js</li>
                <li>JWT Authentication</li>
                <li>Socket.io</li>
              </ul>
            </div>
            <div className="tech-category">
              <h3>Database & Misc</h3>
              <ul className="tech-list">
                <li>MongoDB Atlas</li>
                <li>Leaflet Maps</li>
                <li>Mongoose</li>
                <li>Advanced CSS</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. TEAM MEMBERS SECTION */}
        <section className="about-section">
          <h2 className="section-heading">Project Members</h2>
          <div className="team-grid">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10, boxShadow: '0 0 20px rgba(0,255,255,0.4)' }}
                className="team-card about-glass-card"
              >
                <div className="team-avatar-wrapper">
                  <img src={`https://ui-avatars.com/api/?name=${member.name}&background=0D8ABC&color=fff&size=100`} alt={member.name} className="team-avatar" loading="lazy" />
                </div>
                <h3>{member.name}</h3>
                <h4 className="team-role">{member.role}</h4>
                <p>{member.desc}</p>
                <div className="team-social">
                  <FiGithub className="social-icon" />
                  <FiLinkedin className="social-icon" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. PROJECT FEATURES SECTION */}
        <section className="about-section">
          <h2 className="section-heading">Advanced Features</h2>
          <div className="features-grid">
            {FEATURES.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="feature-chip about-glass-card"
              >
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-title">{feature.title}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. CONTACT US SECTION */}
        <section className="about-section">
          <h2 className="section-heading">Contact Us</h2>
          <div className="contact-container">
            <div className="contact-info about-glass-card">
              <h3>Project Details</h3>
              <div className="contact-detail-row">
                <strong>Email:</strong> realtimebus@gmail.com
              </div>
              <div className="contact-detail-row">
                <strong>Phone:</strong> +91 XXXXXXXXX
              </div>
              <div className="contact-detail-row">
                <strong>College:</strong> Lovely Professional University
              </div>
              <div className="contact-detail-row">
                <strong>Guide:</strong> Priyanka Mahajan
              </div>
              <div className="contact-detail-row">
                <strong>Location:</strong> Punjab, India
              </div>
              <div className="contact-links">
                <a href="#"><FiGithub /> GitHub Repository</a>
                <a href="#"><FiLinkedin /> LinkedIn Page</a>
              </div>
            </div>
            
            <div className="contact-form about-glass-card">
              <h3>Send a Message</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const name = e.target.name.value;
                const email = e.target.email.value;
                const message = e.target.message.value;
                
                try {
                  const res = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      category: `Contact Us - ${name} (${email})`,
                      message: message
                    })
                  });
                  if (res.ok) {
                    alert('Message sent successfully!');
                    e.target.reset();
                  } else {
                    alert('Failed to send message.');
                  }
                } catch (error) {
                  alert('Error sending message.');
                }
              }}>
                <input type="text" name="name" placeholder="Your Name" className="about-input" required />
                <input type="email" name="email" placeholder="Your Email" className="about-input" required />
                <textarea name="message" placeholder="Your Message" rows="4" className="about-input about-textarea" required></textarea>
                <button type="submit" className="about-btn-submit">
                  <FiSend style={{ marginRight: '8px' }} /> Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>

      {/* 7. FOOTER SECTION */}
      <footer className="about-footer about-glass-card">
        <div className="footer-content">
          <div className="footer-left">
            <h3>BusNavigator</h3>
            <p>&copy; {new Date().getFullYear()} Real-Time Bus Tracking System.</p>
            <p>Final Year Project. All Rights Reserved.</p>
          </div>
          <div className="footer-right">
            <div className="footer-social">
              <FiGithub /> <FiLinkedin /> <FiTwitter /> <FiInstagram />
            </div>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
