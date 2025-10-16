import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    totalPrescriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, prescriptionsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/prescriptions')
      ]);

      const appointments = appointmentsRes.data;
      const prescriptions = prescriptionsRes.data;

      setStats({
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
        pendingAppointments: appointments.filter(apt => apt.status === 'scheduled').length,
        totalPrescriptions: prescriptions.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>Clinix Sphere - Doctor Dashboard</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <div>
              <p>Welcome, Dr. {user.name}</p>
              <p>Specialization: {user.specialization}</p>
            </div>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="grid">
          <div className="card">
            <h3>Quick Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#e8f4fd', borderRadius: '4px' }}>
                <h4 style={{ color: '#3498db', fontSize: '2rem', margin: '0' }}>{stats.totalAppointments}</h4>
                <p style={{ margin: '0', color: '#666' }}>Total Appointments</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#e8f8f5', borderRadius: '4px' }}>
                <h4 style={{ color: '#27ae60', fontSize: '2rem', margin: '0' }}>{stats.completedAppointments}</h4>
                <p style={{ margin: '0', color: '#666' }}>Completed</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#fff3cd', borderRadius: '4px' }}>
                <h4 style={{ color: '#f39c12', fontSize: '2rem', margin: '0' }}>{stats.pendingAppointments}</h4>
                <p style={{ margin: '0', color: '#666' }}>Pending</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8d7da', borderRadius: '4px' }}>
                <h4 style={{ color: '#e74c3c', fontSize: '2rem', margin: '0' }}>{stats.totalPrescriptions}</h4>
                <p style={{ margin: '0', color: '#666' }}>Prescriptions</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <Link to="/appointments" className="btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
                Manage Appointments
              </Link>
              <Link to="/prescriptions" className="btn btn-success" style={{ textDecoration: 'none', textAlign: 'center' }}>
                View Prescriptions
              </Link>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Recent Activity</h3>
          <p style={{ color: '#666', marginTop: '1rem' }}>
            Use the navigation above to manage your appointments and prescriptions.
            You can mark appointments as completed and create digital prescriptions for your patients.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
