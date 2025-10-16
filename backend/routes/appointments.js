const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all appointments (filtered by role)
router.get('/', auth, async (req, res) => {
  try {
    let appointments;
    
    if (req.user.role === 'doctor') {
      appointments = await Appointment.find({ doctor: req.user._id })
        .populate('patient', 'name email phone')
        .sort({ appointmentDate: 1 });
    } else {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate('doctor', 'name specialization email phone')
        .sort({ appointmentDate: 1 });
    }

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book new appointment
router.post('/', [
  auth,
  authorize('patient'),
  body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
  body('reason').notEmpty().withMessage('Reason for appointment is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctorId, appointmentDate, appointmentTime, reason, notes } = req.body;

    // Check if doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      notes: notes || ''
    });

    await appointment.save();

    // Populate the appointment with doctor details
    await appointment.populate('doctor', 'name specialization email phone');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status
router.put('/:id', [
  auth,
  authorize('doctor'),
  body('status').isIn(['scheduled', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    await appointment.populate('patient', 'name email phone');

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single appointment
router.get('/:id', auth, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    let appointment;

    if (req.user.role === 'doctor') {
      appointment = await Appointment.findOne({
        _id: appointmentId,
        doctor: req.user._id
      }).populate('patient', 'name email phone address');
    } else {
      appointment = await Appointment.findOne({
        _id: appointmentId,
        patient: req.user._id
      }).populate('doctor', 'name specialization email phone');
    }

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all doctors (for patients to book appointments)
router.get('/doctors/list', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isActive: true })
      .select('name specialization email phone')
      .sort({ name: 1 });

    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
