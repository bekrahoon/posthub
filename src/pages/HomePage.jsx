import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadPosts } from '../redux/slices/postsSlice';
import { loadUsers } from '../redux/slices/usersSlice';
import { LoadingSpinner, ErrorMessage } from '../components/UI';
import { Avatar } from '../components/UI';
import { truncate } from '../utils/helpers';

export default function HomePage() {
  const dispatch = useDispatch();
  const { items: posts, loading: pLoading, error: pError } = useSelector(s => s.posts);
  const { items: users, loading: uLoading } = useSelector(s => s.users);
  const { token } = useSelector(s => s.auth);

  useEffect(() => {
    if (token) {
      if (!posts.length) dispatch(loadPosts());
      if (!users.length) dispatch(loadUsers());
    }
  }, [token]);

  const loading = pLoading || uLoading;
  if (loading && !posts.length) return <LoadingSpinner size="lg" text="Loading dashboard…" />;
  if (pError) return <ErrorMessage message={pError} onRetry={() => dispatch(loadPosts())} />;

  const recentPosts = [...posts].slice(0, 6);
  const usersMap = Object.fromEntries(users.map(u => [u.id, u]));

  return (
    <div className="page fade-in">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Welcome to PostHub</span>
          <h1 className="hero-title">Your Content<br /><em>Management Hub</em></h1>
          <p className="hero-sub">Manage, search and publish posts. Full CRUD with Redux-powered state.</p>
          <div className="hero-cta">
            <Link to="/posts" className="btn btn-primary btn-lg">Browse Posts</Link>
            <Link to="/users" className="btn btn-ghost btn-lg">View Users</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            {recentPosts.slice(0,3).map((p, i) => (
              <div key={p.id} className="hero-mini-card" style={{ transform: `rotate(${(i - 1) * 3}deg)`, zIndex: 3-i }}>
                <p>{truncate(p.title, 45)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-row">
        <div className="stat-card">
          <span className="stat-num">{posts.length}</span>
          <span className="stat-label">Total Posts</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{users.length}</span>
          <span className="stat-label">Authors</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{[...new Set(posts.map(p=>p.userId))].length}</span>
          <span className="stat-label">Active Writers</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{Math.round(posts.length / (users.length || 1))}</span>
          <span className="stat-label">Posts / User</span>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recent Posts</h2>
          <Link to="/posts" className="section-link">View all →</Link>
        </div>
        <div className="recent-posts-grid">
          {recentPosts.map(post => {
            const author = usersMap[post.userId];
            return (
              <Link to={`/posts/${post.id}`} key={post.id} className="recent-post-item">
                <div className="recent-post-top">
                  {author && <Avatar name={author.name} id={author.id} size={24} />}
                  <span className="recent-post-author">{author?.name}</span>
                </div>
                <h4>{truncate(post.title, 60)}</h4>
                <p>{truncate(post.body, 80)}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Authors */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Authors</h2>
          <Link to="/users" className="section-link">View all →</Link>
        </div>
        <div className="authors-strip">
          {users.slice(0, 8).map(u => (
            <Link to={`/users/${u.id}`} key={u.id} className="author-chip">
              <Avatar name={u.name} id={u.id} size={36} />
              <span>{u.name.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
