// Environment Configuration for Clinix Sphere Backend
// Copy this file to .env and update the values as needed

require('dotenv').config();
module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI,
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV
};


