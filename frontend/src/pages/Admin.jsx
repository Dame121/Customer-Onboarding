import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllCustomers } from '../api';

export default function Admin() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getAllCustomers();
        setCustomers(res.data);
      } catch {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <p className="subtitle">All Registered Users ({customers.length})</p>

      {/* Desktop table */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>GSTIN</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.gstin}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>No users registered yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mobile-cards">
        {customers.map((c) => (
          <div className="mobile-card" key={c.id}>
            <div className="mobile-card-row">
              <span className="label">Name</span>
              <span>{c.name}</span>
            </div>
            <div className="mobile-card-row">
              <span className="label">Email</span>
              <span>{c.email}</span>
            </div>
            <div className="mobile-card-row">
              <span className="label">GSTIN</span>
              <span>{c.gstin}</span>
            </div>
          </div>
        ))}
        {customers.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No users registered yet</p>}
      </div>

      <div className="admin-actions">
        <Link to="/dashboard"><button>My Profile</button></Link>
      </div>
    </div>
  );
}
