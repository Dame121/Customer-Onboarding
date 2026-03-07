import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="form-container"><p>Loading...</p></div>;

  return (
    <div className="form-container">
      <h2>Dashboard</h2>
      <p className="subtitle">Welcome back, {profile.name}!</p>
      <div className="profile-card">
        <div className="profile-row">
          <span className="label">Name</span>
          <span>{profile.name}</span>
        </div>
        <div className="profile-row">
          <span className="label">Email</span>
          <span>{profile.email}</span>
        </div>
        <div className="profile-row">
          <span className="label">GSTIN</span>
          <span>{profile.gstin}</span>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
      <p className="link"><Link to="/admin">View Admin Dashboard</Link></p>
    </div>
  );
}
