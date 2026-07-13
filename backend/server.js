// =========================================================================
// SMART EXAM SEAT ALLOCATION SYSTEM - BACKEND SERVER ENTRYPOINT
// =========================================================================
// This file initializes the Express framework, registers global middlewares, 
// connects to the database, and boots up the API server on port 5000.

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors'); // Allows the React frontend (port 5173) to query this server

// Import database connector and consolidated routes
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();

// Initialize Database Connection (MongoDB Atlas or local fallback)
connectDB();

// Global Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable JSON body parsing for requests

// Register API Routes under the '/api' prefix (e.g. /api/auth/login)
app.use('/api', routes);

// Default status probe route
app.get('/', (req, res) => {
  res.send('Smart Exam Seat Allocation API is running (Flat Directory Structure)...');
});

// Global Error Handler - catches any uncaught runtime errors and returns a clean JSON error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!', error: err.message });
});

// Start listening on port 3000 (or platform assigned port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
