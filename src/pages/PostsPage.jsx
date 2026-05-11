import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadPosts,
  selectFilteredPosts,
  setSearchQuery,
  setFilterUserId,
  setSortBy,
} from '../redux/slices/postsSlice';
import { loadUsers } from '../redux/slices/usersSlice';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LoadingSpinner, ErrorMessage, EmptyState, Modal } from '../components/UI';
import { useDebounce } from '../hooks/useDebounce';

export default function PostsPage() {
  const dispatch = useDispatch();
  const { loading, error, searchQuery, filterUserId, sortBy } = useSelector(s => s.posts);
  const { items: users } = useSelector(s => s.users);
  const filteredPosts = useSelector(selectFilteredPosts);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 400);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => { dispatch(loadPosts()); dispatch(loadUsers()); }, []);
  useEffect(() => { dispatch(setSearchQuery(debouncedSearch)); }, [debouncedSearch]);

  const usersMap = Object.fromEntries(users.map(u => [u.id, u]));

  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit   = (post) => { setEditTarget(post); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTarget(null); };

  if (loading && !filteredPosts.length) return <LoadingSpinner size="lg" text="Loading posts…" />;
  if (error) return <ErrorMessage message={error} onRetry={() => dispatch(loadPosts())} />;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Posts</h1>
          <p className="page-subtitle">{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Post</button>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <input
          className="form-input search-input"
          placeholder="Search posts…"
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={filterUserId || ''}
          onChange={e => dispatch(setFilterUserId(e.target.value || null))}
        >
          <option value="">All Authors</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select
          className="form-select"
          value={sortBy}
          onChange={e => dispatch(setSortBy(e.target.value))}
        >
          <option value="id">Sort: Latest</option>
          <option value="title">Sort: A–Z</option>
        </select>
      </div>

      {loading && <div className="loading-overlay"><LoadingSpinner size="sm" text="" /></div>}

      {filteredPosts.length === 0 ? (
        <EmptyState
          title="No posts found"
          message="Try adjusting your search or filters."
          icon="🔍"
        />
      ) : (
        <div className="posts-grid">
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              user={usersMap[post.userId]}
              onEdit={openEdit}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit Post' : 'Create New Post'}
      >
        <PostForm initialData={editTarget} onClose={closeModal} />
      </Modal>
    </div>
  );
}
