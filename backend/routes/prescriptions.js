const express = require('express');
const { body, validationResult } = require('express-validator');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create prescription
router.post('/', [
  auth,
  authorize('doctor'),
  body('appointmentId').isMongoId().withMessage('Valid appointment ID is required'),
  body('symptoms').notEmpty().withMessage('Symptoms are required'),
  body('diagnosis').notEmpty().withMessage('Diagnosis is required'),
  body('medicines').isArray({ min: 1 }).withMessage('At least one medicine is required'),
  body('medicines.*.name').notEmpty().withMessage('Medicine name is required'),
  body('medicines.*.dosage').notEmpty().withMessage('Medicine dosage is required'),
  body('medicines.*.duration').notEmpty().withMessage('Medicine duration is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { appointmentId, symptoms, diagnosis, medicines, additionalNotes } = req.body;

    // Check if appointment exists and belongs to the doctor
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: req.user._id,
      status: 'completed'
    });

    if (!appointment) {
      return res.status(404).json({ 
        message: 'Appointment not found or not completed' 
      });
    }

    // Check if prescription already exists for this appointment
    const existingPrescription = await Prescription.findOne({ appointment: appointmentId });
    if (existingPrescription) {
      return res.status(400).json({ 
        message: 'Prescription already exists for this appointment' 
      });
    }

    const prescription = new Prescription({
      appointment: appointmentId,
      patient: appointment.patient,
      doctor: req.user._id,
      symptoms,
      diagnosis,
      medicines,
      additionalNotes: additionalNotes || ''
    });

    await prescription.save();

    // Update appointment with prescription reference
    appointment.prescription = prescription._id;
    await appointment.save();

    // Populate prescription with patient and doctor details
    await prescription.populate('patient', 'name email phone');
    await prescription.populate('doctor', 'name specialization');

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prescriptions
router.get('/', auth, async (req, res) => {
  try {
    let prescriptions;
    
    if (req.user.role === 'doctor') {
      prescriptions = await Prescription.find({ doctor: req.user._id })
        .populate('patient', 'name email phone')
        .populate('appointment', 'appointmentDate appointmentTime reason')
        .sort({ prescriptionDate: -1 });
    } else {
      prescriptions = await Prescription.find({ patient: req.user._id })
        .populate('doctor', 'name specialization email phone')
        .populate('appointment', 'appointmentDate appointmentTime reason')
        .sort({ prescriptionDate: -1 });
    }

    res.json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single prescription
router.get('/:id', auth, async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    let prescription;

    if (req.user.role === 'doctor') {
      prescription = await Prescription.findOne({
        _id: prescriptionId,
        doctor: req.user._id
      })
      .populate('patient', 'name email phone address')
      .populate('appointment', 'appointmentDate appointmentTime reason notes');
    } else {
      prescription = await Prescription.findOne({
        _id: prescriptionId,
        patient: req.user._id
      })
      .populate('doctor', 'name specialization email phone')
      .populate('appointment', 'appointmentDate appointmentTime reason notes');
    }

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prescription by appointment ID
router.get('/appointment/:appointmentId', auth, async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    let prescription;

    if (req.user.role === 'doctor') {
      prescription = await Prescription.findOne({
        appointment: appointmentId,
        doctor: req.user._id
      })
      .populate('patient', 'name email phone address')
      .populate('appointment', 'appointmentDate appointmentTime reason notes');
    } else {
      prescription = await Prescription.findOne({
        appointment: appointmentId,
        patient: req.user._id
      })
      .populate('doctor', 'name specialization email phone')
      .populate('appointment', 'appointmentDate appointmentTime reason notes');
    }

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found for this appointment' });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Get prescription by appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
