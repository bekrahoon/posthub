import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserById, clearCurrentUser } from '../redux/slices/usersSlice';
import { loadPostsByUser } from '../redux/slices/postsSlice';
import { LoadingSpinner, ErrorMessage, EmptyState, Avatar } from '../components/UI';
import { truncate } from '../utils/helpers';

export default function UserProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser: user, loading: uLoading, error: uError } = useSelector(s => s.users);
  const { userPosts, loading: pLoading } = useSelector(s => s.posts);

  useEffect(() => {
    dispatch(loadUserById(Number(id)));
    dispatch(loadPostsByUser(Number(id)));
    return () => dispatch(clearCurrentUser());
  }, [id]);

  const loading = uLoading || pLoading;
  if (loading && !user) return <LoadingSpinner size="lg" text="Loading profile…" />;
  if (uError) return <ErrorMessage message={uError} />;
  if (!user) return null;

  return (
    <div className="page fade-in">
      <div className="breadcrumb">
        <Link to="/users">← Back to Users</Link>
      </div>

      {/* Profile Card */}
      <div className="profile-header">
        <Avatar name={user.name} id={user.id} size={80} />
        <div className="profile-info">
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-username">@{user.username}</p>
          <div className="profile-details">
            <span>✉ {user.email}</span>
            <span>📞 {user.phone}</span>
            <span>🌐 {user.website}</span>
            <span>📍 {user.address?.city}</span>
          </div>
        </div>
        <div className="profile-company">
          <div className="company-card">
            <span className="company-label">Company</span>
            <span className="company-name">{user.company?.name}</span>
            <span className="company-catch">"{user.company?.catchPhrase}"</span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Posts by {user.name.split(' ')[0]}</h2>
          <span className="section-count">{userPosts.length} posts</span>
        </div>
        {pLoading ? (
          <LoadingSpinner size="sm" text="Loading posts…" />
        ) : userPosts.length === 0 ? (
          <EmptyState title="No posts yet" message="This author hasn't posted anything." icon="📝" />
        ) : (
          <div className="user-posts-list">
            {userPosts.map(post => (
              <Link to={`/posts/${post.id}`} key={post.id} className="user-post-item">
                <span className="user-post-num">#{post.id}</span>
                <div className="user-post-text">
                  <h4>{post.title}</h4>
                  <p>{truncate(post.body, 90)}</p>
                </div>
                <span className="user-post-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
