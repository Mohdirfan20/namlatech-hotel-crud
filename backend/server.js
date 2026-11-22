const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const { initDb, isInMemory } = require('./db');
const hotelRoutes = require('./routes/hotels');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: isInMemory() ? 'in-memory-postgresql' : 'live-postgresql',
    timestamp: new Date().toISOString()
  });
});

// Hotels API routes
app.use('/api/hotels', hotelRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum allowed size is 5MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  if (err.message && err.message.includes('Invalid image format')) {
    return res.status(400).json({ message: err.message });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start server after database initialization
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Hotel API Server running on http://localhost:${PORT}`);
      console.log(`📁 Static files served at http://localhost:${PORT}/uploads`);
      console.log(`🏨 API endpoints: http://localhost:${PORT}/api/hotels`);
      console.log(`===============================================`);
    });
  })
  .catch((err) => {
    console.error('Fatal: Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = app;
