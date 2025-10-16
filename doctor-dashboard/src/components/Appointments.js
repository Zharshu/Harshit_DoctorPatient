import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Appointments = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    symptoms: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
    additionalNotes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { status });
      await fetchAppointments();
      
      if (status === 'completed') {
        setSelectedAppointment(appointments.find(apt => apt._id === appointmentId));
        setShowPrescriptionForm(true);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...prescriptionData.medicines];
    newMedicines[index][field] = value;
    setPrescriptionData({ ...prescriptionData, medicines: newMedicines });
  };

  const addMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: '', dosage: '', duration: '', instructions: '' }]
    });
  };

  const removeMedicine = (index) => {
    const newMedicines = prescriptionData.medicines.filter((_, i) => i !== index);
    setPrescriptionData({ ...prescriptionData, medicines: newMedicines });
  };

  const createPrescription = async (e) => {
    e.preventDefault();
    try {
      await api.post('/prescriptions', {
        appointmentId: selectedAppointment._id,
        ...prescriptionData
      });
      
      setShowPrescriptionForm(false);
      setSelectedAppointment(null);
      setPrescriptionData({
        symptoms: '',
        diagnosis: '',
        medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
        additionalNotes: ''
      });
      await fetchAppointments();
    } catch (error) {
      console.error('Error creating prescription:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading Appointments...</h2>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>Manage Appointments</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <div>
              <Link to="/" className="btn" style={{ marginRight: '1rem' }}>Dashboard</Link>
              <Link to="/prescriptions" className="btn">Prescriptions</Link>
            </div>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="card">
          <h3>Your Appointments</h3>
          {appointments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              No appointments found.
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      <div>
                        <strong>{appointment.patient.name}</strong>
                        <br />
                        <small>{appointment.patient.email}</small>
                        <br />
                        <small>{appointment.patient.phone}</small>
                      </div>
                    </td>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    <td>{formatTime(appointment.appointmentTime)}</td>
                    <td>{appointment.reason}</td>
                    <td>
                      <span className={`status status-${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                          className="btn btn-success"
                        >
                          Mark Completed
                        </button>
                      )}
                      {appointment.status === 'completed' && (
                        <span style={{ color: '#27ae60' }}>✓ Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Prescription Form Modal */}
      {showPrescriptionForm && selectedAppointment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3>Create Prescription for {selectedAppointment.patient.name}</h3>
            <form onSubmit={createPrescription}>
              <div className="form-group">
                <label>Symptoms:</label>
                <textarea
                  value={prescriptionData.symptoms}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, symptoms: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Diagnosis:</label>
                <textarea
                  value={prescriptionData.diagnosis}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Medicines:</label>
                {prescriptionData.medicines.map((medicine, index) => (
                  <div key={index} className="medicine-item">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label>Medicine Name:</label>
                        <input
                          type="text"
                          value={medicine.name}
                          onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label>Dosage:</label>
                        <input
                          type="text"
                          value={medicine.dosage}
                          onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label>Duration:</label>
                        <input
                          type="text"
                          value={medicine.duration}
                          onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label>Instructions:</label>
                        <input
                          type="text"
                          value={medicine.instructions}
                          onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                        />
                      </div>
                    </div>
                    {prescriptionData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="btn btn-danger"
                        style={{ fontSize: '0.875rem' }}
                      >
                        Remove Medicine
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMedicine}
                  className="btn btn-warning"
                >
                  Add Medicine
                </button>
              </div>

              <div className="form-group">
                <label>Additional Notes:</label>
                <textarea
                  value={prescriptionData.additionalNotes}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, additionalNotes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-success">
                  Create Prescription
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrescriptionForm(false)}
                  className="btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
