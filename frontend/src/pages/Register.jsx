import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCustomer } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', gstin: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.gstin.length !== 15) {
      setError('GSTIN must be exactly 15 characters');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await registerCustomer(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      <p className="subtitle">Register as an Exporter / Importer</p>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            placeholder="e.g. Rajesh Kumar"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. rajesh@company.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="gstin">GSTIN</label>
          <input
            id="gstin"
            name="gstin"
            placeholder="e.g. 22AAAAA0000A1Z5"
            value={form.gstin}
            onChange={handleChange}
            maxLength={15}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      <p className="link">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
