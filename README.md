# Doctor-Patient Appointment & Digital Prescription System

A comprehensive healthcare management system with separate interfaces for doctors and patients.

## 🏥 Project Overview

Clinix Sphere is a complete healthcare management solution that enables:
- **Patients** to book appointments and view digital prescriptions via mobile app
- **Doctors** to manage appointments and create digital prescriptions via web dashboard
- **Digital prescriptions** with symptoms, diagnosis, and medicine details
- **Role-based authentication** with JWT security

## 📁 Project Structure

```
clinix-sphere/
├── backend/                 # Node.js/Express API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   └── server.js           # Main server file
├── doctor-dashboard/        # React web app for doctors
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   └── services/        # API services
│   └── public/
├── patient-mobile/          # React Native app for patients
│   ├── src/
│   │   ├── screens/        # Mobile screens
│   │   ├── navigation/     # Navigation setup
│   │   ├── context/         # Auth context
│   │   └── services/        # API services
│   └── App.js
└── README.md
```

## ✨ Features

### 🔐 Authentication & Roles
- JWT-based authentication for doctors and patients
- Role-based access control
- Secure password hashing with bcrypt

### 📅 Appointment Management
- **Patients**: View doctors, book appointments, track status
- **Doctors**: View assigned appointments, mark as completed
- Real-time appointment status updates

### 💊 Digital Prescriptions
- Create prescriptions after completing appointments
- Include symptoms, diagnosis, medicines with dosage/duration
- Patients can view all their prescriptions
- Medicine management with detailed instructions

### 🎯 User Interfaces
- **Doctor Dashboard**: React web app with appointment and prescription management
- **Patient Mobile App**: React Native app with intuitive booking and viewing

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Doctor Dashboard**: React.js, React Router, Axios
- **Patient App**: React Native, Expo, React Navigation
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with role-based access

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Expo CLI (`npm install -g expo-cli`)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd clinix-sphere
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will start on `http://localhost:5000`

### 3. Doctor Dashboard Setup
```bash
cd doctor-dashboard
npm install
npm start
```
The dashboard will start on `http://localhost:3000`

### 4. Patient Mobile App Setup
```bash
cd patient-mobile
npm install
expo start
```
Scan the QR code with Expo Go app on your mobile device.

## 📱 Demo Credentials

### Doctor Login
- **Email**: sarah.johnson@clinix.com
- **Password**: password123

### Patient Registration
- Register as a new patient through the mobile app
- Or use any email/password combination

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (doctor/patient)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Appointments
- `GET /api/appointments` - Get appointments (filtered by role)
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/:id` - Update appointment status
- `GET /api/appointments/doctors/list` - Get available doctors

### Prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions` - Get prescriptions (filtered by role)
- `GET /api/prescriptions/:id` - Get single prescription
- `GET /api/prescriptions/appointment/:appointmentId` - Get prescription by appointment

## 🗄 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'doctor' | 'patient',
  specialization: String (for doctors),
  phone: String,
  address: String,
  isActive: Boolean
}
```

### Appointment Model
```javascript
{
  patient: ObjectId (User),
  doctor: ObjectId (User),
  appointmentDate: Date,
  appointmentTime: String,
  status: 'scheduled' | 'completed' | 'cancelled',
  reason: String,
  notes: String,
  prescription: ObjectId (Prescription)
}
```

### Prescription Model
```javascript
{
  appointment: ObjectId (Appointment),
  patient: ObjectId (User),
  doctor: ObjectId (User),
  symptoms: String,
  diagnosis: String,
  medicines: [{
    name: String,
    dosage: String,
    duration: String,
    instructions: String
  }],
  additionalNotes: String,
  prescriptionDate: Date
}
```

## 🎯 User Workflows

### Patient Workflow
1. **Register/Login** via mobile app
2. **Browse Doctors** by specialization
3. **Book Appointment** with preferred doctor and time
4. **Track Appointment** status
5. **View Prescriptions** after appointment completion

### Doctor Workflow
1. **Login** via web dashboard
2. **View Appointments** assigned to them
3. **Mark Appointments** as completed
4. **Create Prescriptions** with symptoms, diagnosis, and medicines
5. **Manage Prescriptions** and view patient history

## 🔧 Configuration

### Backend Configuration
Update `backend/config.js` for:
- MongoDB connection string
- JWT secret key
- Server port

### Mobile App Configuration
Update `patient-mobile/src/services/api.js` for:
- Backend API URL (default: http://localhost:5000/api)

## 🧪 Testing

### Manual Testing Steps
1. **Backend**: Test API endpoints using Postman or curl
2. **Doctor Dashboard**: Login and manage appointments
3. **Mobile App**: Register patient and book appointments
4. **End-to-End**: Complete appointment booking to prescription creation

### Test Scenarios
- User registration and login
- Appointment booking and status updates
- Prescription creation and viewing
- Role-based access control

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, AWS, or similar platform

### Frontend Deployment
1. **Doctor Dashboard**: Deploy to Netlify, Vercel, or similar
2. **Mobile App**: Build with Expo and publish to app stores

## 📋 Development Status

- [x] Project structure setup
- [x] Backend API implementation
- [x] Database models and schemas
- [x] Authentication system
- [x] Doctor dashboard (React)
- [x] Patient mobile app (React Native)
- [x] Appointment management
- [x] Digital prescription system
- [x] Documentation
- [ ] Testing and validation
- [ ] Deployment setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review the API endpoints
3. Test with provided demo credentials
4. Create an issue in the repository

---

**Clinix Sphere** - Your Health, Our Priority 🏥
