import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Prescriptions = () => {
  const { user, logout } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/prescriptions');
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading Prescriptions...</h2>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>Prescriptions</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <div>
              <Link to="/" className="btn" style={{ marginRight: '1rem' }}>Dashboard</Link>
              <Link to="/appointments" className="btn">Appointments</Link>
            </div>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="card">
          <h3>All Prescriptions</h3>
          {prescriptions.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              No prescriptions found.
            </p>
          ) : (
            <div className="grid">
              {prescriptions.map((prescription) => (
                <div key={prescription._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h4>Patient: {prescription.patient.name}</h4>
                      <p><strong>Date:</strong> {formatDate(prescription.prescriptionDate)}</p>
                      <p><strong>Appointment:</strong> {formatDate(prescription.appointment.appointmentDate)} at {prescription.appointment.appointmentTime}</p>
                    </div>
                    <button
                      onClick={() => setSelectedPrescription(selectedPrescription === prescription._id ? null : prescription._id)}
                      className="btn"
                    >
                      {selectedPrescription === prescription._id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  {selectedPrescription === prescription._id && (
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <h5>Symptoms:</h5>
                        <p style={{ background: '#f8f9fa', padding: '0.5rem', borderRadius: '4px' }}>
                          {prescription.symptoms}
                        </p>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <h5>Diagnosis:</h5>
                        <p style={{ background: '#f8f9fa', padding: '0.5rem', borderRadius: '4px' }}>
                          {prescription.diagnosis}
                        </p>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <h5>Medicines:</h5>
                        {prescription.medicines.map((medicine, index) => (
                          <div key={index} className="medicine-item">
                            <h4>{medicine.name}</h4>
                            <p><strong>Dosage:</strong> {medicine.dosage}</p>
                            <p><strong>Duration:</strong> {medicine.duration}</p>
                            {medicine.instructions && (
                              <p><strong>Instructions:</strong> {medicine.instructions}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      {prescription.additionalNotes && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h5>Additional Notes:</h5>
                          <p style={{ background: '#f8f9fa', padding: '0.5rem', borderRadius: '4px' }}>
                            {prescription.additionalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
