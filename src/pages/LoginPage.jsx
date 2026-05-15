import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, LoadingSpinner } from '../components/UI';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.password) e.password = 'Password is required';
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

    const result = await dispatch(login({
      username: form.username,
      password: form.password,
    }));

    if (!result.error) {
      navigate('/posts');
    }
  };

  return (
    <div className="page fade-in" style={{ maxWidth: '500px', margin: '80px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2em', marginBottom: '10px' }}>Welcome Back</h1>
        <p style={{ color: '#666' }}>Login to your PostHub account</p>
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
            placeholder="Enter your username"
          />
          {errors.username && <span className="form-error">{errors.username}</span>}
        </div>

        <div>
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
