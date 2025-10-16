const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Seed initial doctors if database is empty
  seedInitialData();
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Clinix Sphere API is running',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: config.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Seed initial data function
async function seedInitialData() {
  try {
    const User = require('./models/User');
    
    // Check if doctors already exist
    const doctorCount = await User.countDocuments({ role: 'doctor' });
    
    if (doctorCount === 0) {
      console.log('Seeding initial doctor data...');
      
      const doctors = [
        {
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@clinix.com',
          password: 'password123',
          role: 'doctor',
          specialization: 'Cardiology',
          phone: '+1-555-0101',
          address: '123 Medical Center, Health City'
        },
        {
          name: 'Dr. Michael Chen',
          email: 'michael.chen@clinix.com',
          password: 'password123',
          role: 'doctor',
          specialization: 'Neurology',
          phone: '+1-555-0102',
          address: '456 Brain Institute, Medical District'
        },
        {
          name: 'Dr. Emily Rodriguez',
          email: 'emily.rodriguez@clinix.com',
          password: 'password123',
          role: 'doctor',
          specialization: 'Pediatrics',
          phone: '+1-555-0103',
          address: '789 Children Hospital, Care Avenue'
        },
        {
          name: 'Dr. David Wilson',
          email: 'david.wilson@clinix.com',
          password: 'password123',
          role: 'doctor',
          specialization: 'Orthopedics',
          phone: '+1-555-0104',
          address: '321 Bone Clinic, Recovery Street'
        }
      ];

      for (const doctor of doctors) {
        const existingDoctor = await User.findOne({ email: doctor.email });
        if (!existingDoctor) {
          const newDoctor = new User(doctor);
          await newDoctor.save();
          console.log(`Created doctor: ${doctor.name}`);
        }
      }
      
      console.log('Initial doctor data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
