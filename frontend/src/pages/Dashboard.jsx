import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiClock, FiUsers, FiShare2, FiMapPin, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { FaBus, FaUsers, FaGasPump } from 'react-icons/fa';
import { BsClockHistory } from 'react-icons/bs';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import LiveNetworkMap from '../components/LiveNetworkMap';
import './Dashboard.css';

const Dashboard = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({ totalBuses: 0, activeBuses: 0, totalRoutes: 0, totalUsers: 0 });

  useEffect(() => {
    setIsMounted(true);
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const passengerTrendsData = [
    { name: '10 April', users: 100 },
    { name: '12 April', users: 200 },
    { name: '14 April', users: 150 },
    { name: '18 April', users: 300 },
    { name: '20 April', users: 220 },
    { name: '22 April', users: 280 },
    { name: '25 April', users: 400 },
    { name: '30 April', users: 500 },
  ];

  const miniChartData1 = [{ v: 20 }, { v: 40 }, { v: 30 }, { v: 50 }, { v: 40 }, { v: 70 }, { v: 80 }];
  const miniChartData2 = [{ v: 80 }, { v: 60 }, { v: 70 }, { v: 50 }, { v: 60 }, { v: 90 }, { v: 85 }];

  if (!isMounted) return null;

  return (
    <div className="dash-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="dash-wrapper"
      >
        {/* Top Metrics Row */}
        <div className="dash-top-row">
          <div className="metric-card-small glass">
            <div className="metric-card-title">Total Buses</div>
            <div className="metric-card-val">{stats.totalBuses}</div>
            <div className="metric-card-sub"><span className="metric-perc up">+12.6%</span> from yesterday</div>
            <div className="metric-icon-tr" style={{ color: '#3b82f6' }}><FaBus /></div>
          </div>
          <div className="metric-card-small glass">
            <div className="metric-card-title">Active Buses</div>
            <div className="metric-card-val">{stats.activeBuses}</div>
            <div className="metric-card-sub">77.2% on road</div>
            <div className="metric-icon-tr" style={{ color: '#34d399' }}><FaBus /></div>
          </div>
          <div className="metric-card-small glass">
            <div className="metric-card-title">Passengers Today</div>
            <div className="metric-card-val">357</div>
            <div className="metric-card-sub"><span className="metric-perc up">+18.7%</span> from yesterday</div>
            <div className="metric-icon-tr" style={{ color: '#a855f7' }}><FaUsers /></div>
          </div>
          <div className="metric-card-small glass">
            <div className="metric-card-title">On Time Performance</div>
            <div className="metric-card-val">88.4%</div>
            <div className="metric-card-sub"><span className="metric-perc up">+5.3%</span> from yesterday</div>
            <div className="metric-icon-tr" style={{ color: '#3b82f6' }}><BsClockHistory /></div>
          </div>
          <div className="metric-card-small glass">
            <div className="metric-card-title">Total Routes</div>
            <div className="metric-card-val">{stats.totalRoutes}</div>
            <div className="metric-card-sub">Across Punjab</div>
            <div className="metric-icon-tr" style={{ color: '#f59e0b' }}><FiShare2 /></div>
          </div>
          <div className="metric-card-small glass">
            <div className="metric-card-title">Total Terminals</div>
            <div className="metric-card-val">23</div>
            <div className="metric-card-sub">Across Punjab</div>
            <div className="metric-icon-tr" style={{ color: '#14b8a6' }}><FiMapPin /></div>
          </div>
        </div>

        {/* Middle Row */}
        <div className="dash-middle-row">
          {/* Live Map Box */}
          <div className="map-section glass">
            <div className="map-title">Live Map - Punjab</div>
            <div className="map-subtitle">Track all active buses</div>
            <div style={{ flex: 1, position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
              <LiveNetworkMap />
            </div>
          </div>

          {/* Upcoming Arrivals Box */}
          <div className="arrivals-section glass">
            <div className="map-title">Upcoming Arrivals</div>
            <div className="map-subtitle">Next buses at selected stop</div>
            <select className="dropdown-glass" style={{backgroundColor: 'rgba(15, 23, 42, 0.7)', color: 'white'}}>
              <option>ISBT Ludhiana</option>
              <option>ISBT Chandigarh</option>
              <option>Jalandhar Bus Stand</option>
            </select>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div className="arrival-item">
                <div className="arrival-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}><FaBus /></div>
                <div className="arrival-info">
                  <div className="arrival-name">PRTC Volvo</div>
                  <div className="arrival-route">Chandigarh • PB 01 A 1234</div>
                </div>
                <div className="arrival-time">2 <span style={{fontSize: '0.7rem', fontWeight: 'normal'}}>min</span></div>
              </div>
              <div className="arrival-item">
                <div className="arrival-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}><FaBus /></div>
                <div className="arrival-info">
                  <div className="arrival-name">PRTC Ordinary</div>
                  <div className="arrival-route">Amritsar • PB 03 B 5678</div>
                </div>
                <div className="arrival-time">5 <span style={{fontSize: '0.7rem', fontWeight: 'normal'}}>min</span></div>
              </div>
              <div className="arrival-item">
                <div className="arrival-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}><FaBus /></div>
                <div className="arrival-info">
                  <div className="arrival-name">PRTC Volvo</div>
                  <div className="arrival-route">Patiala • PB 11 C 9101</div>
                </div>
                <div className="arrival-time">8 <span style={{fontSize: '0.7rem', fontWeight: 'normal'}}>min</span></div>
              </div>
              <div className="arrival-item">
                <div className="arrival-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}><FaBus /></div>
                <div className="arrival-info">
                  <div className="arrival-name">PRTC Ordinary</div>
                  <div className="arrival-route">Bathinda • PB 05 D 4321</div>
                </div>
                <div className="arrival-time">12 <span style={{fontSize: '0.7rem', fontWeight: 'normal'}}>min</span></div>
              </div>
              <div className="arrival-item" style={{ borderBottom: 'none' }}>
                <div className="arrival-icon" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }}><FaBus /></div>
                <div className="arrival-info">
                  <div className="arrival-name">PRTC Volvo</div>
                  <div className="arrival-route">Jalandhar • PB 01 A 1234</div>
                </div>
                <div className="arrival-time">15 <span style={{fontSize: '0.7rem', fontWeight: 'normal'}}>min</span></div>
              </div>
              <div className="arrival-item" style={{ borderBottom: 'none' }}>
                <div className="arrival-icon" style={{ background: 'rgba(24, 228, 197, 0.35)', color: '#a855f7' }}><FaBus /></div>
                <div className="arrival-info">
                  <div className="arrival-name">PRTC Travelers</div>
                  <div className="arrival-route">Ludhiana • PB 012 A 1534</div>
                </div>
                <div className="arrival-time">11 <span style={{fontSize: '0.7rem', fontWeight: 'normal'}}>min</span></div>
              </div>
              <div className="arrival-item" style={{ borderBottom: 'none' }}>
                <div className="arrival-icon" style={{ background: 'rgba(104, 169, 24, 0.47)', color: '#a855f7' }}><FaBus /></div>
                <div className="arrival-info">
                  <div className="arrival-name">PRTC Swati</div>
                  <div className="arrival-route">khana • PB 44 D 9473</div>
                </div>
                <div className="arrival-time">8 <span style={{fontSize: '0.7rem', fontWeight: 'normal'}}>min</span></div>
              </div>
              <div className="arrival-item" style={{ borderBottom: 'none' }}>
                <div className="arrival-icon" style={{ background: 'rgba(204, 34, 54, 0.47)', color: '#a855f7' }}><FaBus /></div>
                <div className="arrival-info">
                  <div className="arrival-name">Punjab Roadways</div>
                  <div className="arrival-route">Khana • PB 77 F 4785</div>
                </div>
                <div className="arrival-time">14 <span style={{fontSize: '0.7rem', fontWeight: 'normal'}}>min</span></div>
              </div>
              <div className="arrival-item" style={{ borderBottom: 'none' }}>
                <div className="arrival-icon" style={{ background: 'rgba(218, 130, 52, 0.36)', color: '#a855f7' }}><FaBus /></div>
                <div className="arrival-info">
                  <div className="arrival-name">Panipet Roadways</div>
                  <div className="arrival-route">panipet • PB 32 A 4093</div>
                </div>
                <div className="arrival-time">7 <span style={{fontSize: '0.7rem', fontWeight: 'normal'}}>min</span></div>
              </div>
              <div className="arrival-item" style={{ borderBottom: 'none' }}>
                <div className="arrival-icon" style={{ background: 'rgba(180, 197, 29, 0.32)', color: '#a855f7' }}><FaBus /></div>
                <div className="arrival-info">
                  <div className="arrival-name">Punjab Travlers</div>
                  <div className="arrival-route">Ambala • PB 22 F 4569</div>
                </div>
                <div className="arrival-time">17 <span style={{fontSize: '0.7rem', fontWeight: 'normal'}}>min</span></div>
              </div>
            </div>
          </div>

          {/* Charts Box */}
          <div className="charts-section">
            <div className="chart-card glass">
              <div className="chart-header">
                <div>
                  <div className="chart-title">Daily Passenger Trends</div>
                  <div className="chart-subtitle">Total passengers over time</div>
                </div>
                <select className="dropdown-glass" style={{ width: 'auto', marginBottom: 0, padding: '0.2rem 0.5rem', fontSize: '0.8rem',backgroundColor:'rgb(10, 20, 40)',color:'white' }}>
                  <option>April Month</option>
                  <option>March Month</option>
                </select>
              </div>
              <div style={{ flex: 1, minHeight: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={passengerTrendsData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(v) => `${v}K`} />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                    <Area type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card glass">
              <div className="chart-header">
                <div>
                  <div className="chart-title">Top Routes by Passengers</div>
                  <div className="chart-subtitle">This week</div>
                </div>
                <div style={{ color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer' }}>View All</div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="top-route-item">
                  <div style={{ width: '120px' }}>Chandigarh - Amritsar</div>
                  <div className="route-bar-bg"><div className="route-bar-fill" style={{ width: '90%', background: '#a855f7' }}></div></div>
                  <div style={{ width: '40px', textAlign: 'right' }}>450</div>
                </div>
                <div className="top-route-item">
                  <div style={{ width: '120px' }}>Ludhiana - Delhi</div>
                  <div className="route-bar-bg"><div className="route-bar-fill" style={{ width: '75%', background: '#3b82f6' }}></div></div>
                  <div style={{ width: '40px', textAlign: 'right' }}>387</div>
                </div>
                <div className="top-route-item">
                  <div style={{ width: '120px' }}>Patiala - Chandigarh</div>
                  <div className="route-bar-bg"><div className="route-bar-fill" style={{ width: '60%', background: '#10b981' }}></div></div>
                  <div style={{ width: '40px', textAlign: 'right' }}>321</div>
                </div>
                <div className="top-route-item">
                  <div style={{ width: '120px' }}>Jalandhar - Ludhiana</div>
                  <div className="route-bar-bg"><div className="route-bar-fill" style={{ width: '55%', background: '#f59e0b' }}></div></div>
                  <div style={{ width: '40px', textAlign: 'right' }}>295</div>
                </div>
                <div className="top-route-item" style={{ marginBottom: 0 }}>
                  <div style={{ width: '120px' }}>Bathinda - Chandigarh</div>
                  <div className="route-bar-bg"><div className="route-bar-fill" style={{ width: '45%', background: '#ef4444' }}></div></div>
                  <div style={{ width: '40px', textAlign: 'right' }}>249</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Row */}
        <div className="dash-bottom-row">
          <div className="metric-card-small glass">
            <div className="metric-card-title">Occupancy</div>
            <div className="metric-card-sub">Average bus occupancy</div>
            <div className="metric-card-val" style={{ marginTop: '0.5rem' }}>72% <span className="metric-perc up" style={{fontSize: '0.8rem'}}>+6.4%</span></div>
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData1}>
                  <Area type="monotone" dataKey="v" stroke="#a855f7" strokeWidth={2} fillOpacity={0.2} fill="#a855f7" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="metric-card-small glass">
            <div className="metric-card-title">On Time Performance</div>
            <div className="metric-card-sub">This week</div>
            <div className="metric-card-val" style={{ marginTop: '0.5rem' }}>88.4% <span className="metric-perc up" style={{fontSize: '0.8rem'}}>+5.3%</span></div>
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData2}>
                  <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fillOpacity={0.2} fill="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="metric-card-small glass">
            <div className="metric-card-title">Total Passengers</div>
            <div className="metric-card-sub">Today</div>
            <div className="metric-card-val" style={{ marginTop: '0.5rem' }}>3678<span className="metric-perc up" style={{fontSize: '0.8rem'}}>+18.7%</span></div>
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData1}>
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fillOpacity={0.2} fill="#3b82f6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="metric-card-small glass">
            <div className="metric-card-title">Total Revenue</div>
            <div className="metric-card-sub">This Month</div>
            <div className="metric-card-val" style={{ marginTop: '0.5rem' }}>₹799<span className="metric-perc up" style={{fontSize: '0.8rem'}}>+14.2%</span></div>
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData2}>
                  <Area type="monotone" dataKey="v" stroke="#a855f7" strokeWidth={2} fillOpacity={0.2} fill="#a855f7" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="metric-card-small glass">
            <div className="metric-card-title">Fuel Efficiency</div>
            <div className="metric-card-sub">Average (Km/Litre)</div>
            <div className="metric-card-val" style={{ marginTop: '0.5rem' }}>4.2 km/l <span className="metric-perc up" style={{fontSize: '0.8rem'}}>+3.1%</span></div>
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData1}>
                  <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fillOpacity={0.2} fill="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="metric-card-small glass">
            <div className="metric-card-title">Delay Summary</div>
            <div className="metric-card-sub">Total delays today</div>
            <div className="metric-card-val" style={{ marginTop: '0.5rem' }}>243 <span className="metric-perc down" style={{fontSize: '0.8rem'}}>-11.2%</span></div>
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData2}>
                  <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} fillOpacity={0.2} fill="#ef4444" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Dashboard;
