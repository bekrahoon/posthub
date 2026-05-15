import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, LoadingSpinner } from '../components/UI';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  const [form, setForm] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.password) e.password = 'Password is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }

    const result = await dispatch(register({
      username: form.username,
      email: form.email,
      name: form.name,
      password: form.password,
      confirmPassword: form.confirmPassword,
    }));

    if (!result.error) {
      navigate('/posts');
    }
  };

  return (
    <div className="page fade-in" style={{ maxWidth: '500px', margin: '60px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2em', marginBottom: '10px' }}>Create Account</h1>
        <p style={{ color: '#666' }}>Join PostHub to share your thoughts</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className={`form-input ${errors.username ? 'input-error' : ''}`}
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
          />
          {errors.username && <span className="form-error">{errors.username}</span>}
        </div>

        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div>
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div>
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div>
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'Creating Account…' : 'Register'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
