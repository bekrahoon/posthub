import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage       from '../pages/HomePage';
import PostsPage      from '../pages/PostsPage';
import PostDetailPage from '../pages/PostDetailPage';
import UsersPage      from '../pages/UsersPage';
import UserProfilePage from '../pages/UserProfilePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage   from '../pages/NotFoundPage';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(s => s.auth);
  return token ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  const { token } = useSelector(s => s.auth);

  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/login"     element={token ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register"  element={token ? <Navigate to="/" /> : <RegisterPage />} />
      <Route path="/posts"     element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
      <Route path="/posts/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
      <Route path="/users"     element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/users/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="*"          element={<NotFoundPage />} />
    </Routes>
  );
}
