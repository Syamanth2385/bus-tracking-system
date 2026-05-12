const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  runSimulation();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const alertRoutes = require('./routes/alertRoutes');
const statsRoutes = require('./routes/statsRoutes');
const runSimulation = require('./simulation');

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/status', (req, res) => {
  const isConnected = require('mongoose').connection.readyState === 1;
  res.json({ 
    dbConnected: isConnected, 
    message: isConnected ? "Client is Connected" : "Client is Not Connected" 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/stats', statsRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*any', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
