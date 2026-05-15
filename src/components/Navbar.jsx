import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector(s => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">PostHub</span>
      </NavLink>
      <nav className="navbar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
        {token && (
          <>
            <NavLink to="/posts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Posts
            </NavLink>
            <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Users
            </NavLink>
          </>
        )}
      </nav>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {token && user ? (
          <>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Welcome, <strong>{user.name}</strong>
            </span>
            <button className="btn btn-ghost" onClick={handleLogout} style={{ fontSize: '14px' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-ghost">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-primary">
              Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
