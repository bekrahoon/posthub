import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removePost } from '../redux/slices/postsSlice';
import { Avatar } from './UI';
import { truncate } from '../utils/helpers';

export default function PostCard({ post, user, onEdit }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Delete this post?')) dispatch(removePost(post.id));
  };

  return (
    <article className="post-card">
      <div className="post-card-header">
        <div className="post-meta">
          {user && (
            <Link to={`/users/${user.id}`} className="post-author">
              <Avatar name={user.name} id={user.id} size={28} />
              <span>{user.name}</span>
            </Link>
          )}
          <span className="post-id">#{post.id}</span>
        </div>
      </div>
      <Link to={`/posts/${post.id}`} className="post-title-link">
        <h3 className="post-title">{truncate(post.title, 70)}</h3>
      </Link>
      <p className="post-body">{truncate(post.body, 100)}</p>
      <div className="post-card-footer">
        <Link to={`/posts/${post.id}`} className="btn btn-ghost btn-sm">Read →</Link>
        <div className="post-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(post)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </article>
  );
}
