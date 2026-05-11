import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, editPost } from '../redux/slices/postsSlice';

export default function PostForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(s => s.posts);
  const { items: users } = useSelector(s => s.users);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    body: initialData?.body || '',
    userId: initialData?.userId || 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) setForm({ title: initialData.title, body: initialData.body, userId: initialData.userId });
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters';
    if (!form.body.trim()) e.body = 'Content is required';
    if (form.body.trim().length < 10) e.body = 'Content must be at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const action = initialData
      ? editPost({ id: initialData.id, data: { ...form, userId: Number(form.userId) } })
      : addPost({ ...form, userId: Number(form.userId) });

    const result = await dispatch(action);
    if (!result.error) onClose();
  };

  return (
    <div className="post-form">
      <div className="form-group">
        <label className="form-label">Author</label>
        <select name="userId" className="form-select" value={form.userId} onChange={handleChange}>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          name="title"
          className={`form-input ${errors.title ? 'input-error' : ''}`}
          value={form.title}
          onChange={handleChange}
          placeholder="Enter post title…"
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Content</label>
        <textarea
          name="body"
          className={`form-input form-textarea ${errors.body ? 'input-error' : ''}`}
          value={form.body}
          onChange={handleChange}
          placeholder="Write your content…"
          rows={5}
        />
        {errors.body && <span className="form-error">{errors.body}</span>}
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving…' : initialData ? 'Save Changes' : 'Create Post'}
        </button>
      </div>
    </div>
  );
}
