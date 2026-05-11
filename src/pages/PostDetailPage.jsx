import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadPostById, loadComments, clearCurrentPost, removePost } from '../redux/slices/postsSlice';
import { loadUsers } from '../redux/slices/usersSlice';
import PostForm from '../components/PostForm';
import { LoadingSpinner, ErrorMessage, Modal, Avatar } from '../components/UI';

export default function PostDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost: post, currentComments: comments, loading, error } = useSelector(s => s.posts);
  const { items: users } = useSelector(s => s.users);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(loadPostById(Number(id)));
    dispatch(loadComments(Number(id)));
    if (!users.length) dispatch(loadUsers());
    return () => dispatch(clearCurrentPost());
  }, [id]);

  if (loading && !post) return <LoadingSpinner size="lg" text="Loading post…" />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return null;

  const author = users.find(u => u.id === post.userId);

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      await dispatch(removePost(post.id));
      navigate('/posts');
    }
  };

  return (
    <div className="page fade-in">
      <div className="breadcrumb">
        <Link to="/posts">← Back to Posts</Link>
      </div>

      <article className="post-detail">
        <header className="post-detail-header">
          <div className="post-detail-meta">
            {author && (
              <Link to={`/users/${author.id}`} className="post-author">
                <Avatar name={author.name} id={author.id} size={36} />
                <div>
                  <span className="author-name">{author.name}</span>
                  <span className="author-sub">@{author.username}</span>
                </div>
              </Link>
            )}
            <span className="post-id-badge">#{post.id}</span>
          </div>
          <div className="post-detail-actions">
            <button className="btn btn-ghost" onClick={() => setEditOpen(true)}>Edit</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </header>

        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-body">
          {post.body.split('\n').map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </article>

      {/* Comments */}
      <section className="comments-section">
        <h2 className="comments-title">Comments <span className="comment-count">{comments.length}</span></h2>
        {loading ? (
          <LoadingSpinner size="sm" text="Loading comments…" />
        ) : comments.length === 0 ? (
          <p className="no-comments">No comments yet.</p>
        ) : (
          <div className="comments-list">
            {comments.map(c => (
              <div key={c.id} className="comment-card">
                <div className="comment-header">
                  <strong className="comment-name">{c.name}</strong>
                  <span className="comment-email">{c.email}</span>
                </div>
                <p className="comment-body">{c.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Post">
        <PostForm initialData={post} onClose={() => setEditOpen(false)} />
      </Modal>
    </div>
  );
}
