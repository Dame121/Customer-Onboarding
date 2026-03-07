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

  if (loading) return <div className="form-container"><p>Loading...</p></div>;

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <p className="subtitle">All Registered Users ({customers.length})</p>
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
                <td colSpan="4" style={{ textAlign: 'center' }}>No users registered yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="admin-actions">
        <Link to="/dashboard"><button>My Profile</button></Link>
      </div>
    </div>
  );
}
