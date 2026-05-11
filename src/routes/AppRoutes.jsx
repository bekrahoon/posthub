import { Routes, Route } from 'react-router-dom';
import HomePage       from '../pages/HomePage';
import PostsPage      from '../pages/PostsPage';
import PostDetailPage from '../pages/PostDetailPage';
import UsersPage      from '../pages/UsersPage';
import UserProfilePage from '../pages/UserProfilePage';
import NotFoundPage   from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/posts"     element={<PostsPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/users"     element={<UsersPage />} />
      <Route path="/users/:id" element={<UserProfilePage />} />
      <Route path="*"          element={<NotFoundPage />} />
    </Routes>
  );
}
