import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsers, setUserSearch, selectFilteredUsers } from '../redux/slices/usersSlice';
import UserCard from '../components/UserCard';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UI';
import { useDebounce } from '../hooks/useDebounce';

export default function UsersPage() {
  const dispatch = useDispatch();
  const { loading, error, searchQuery } = useSelector(s => s.users);
  const filteredUsers = useSelector(selectFilteredUsers);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => { dispatch(loadUsers()); }, []);
  useEffect(() => { dispatch(setUserSearch(debouncedSearch)); }, [debouncedSearch]);

  if (loading && !filteredUsers.length) return <LoadingSpinner size="lg" text="Loading users…" />;
  if (error) return <ErrorMessage message={error} onRetry={() => dispatch(loadUsers())} />;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{filteredUsers.length} author{filteredUsers.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="controls-bar">
        <input
          className="form-input search-input"
          placeholder="Search by name, email or username…"
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState title="No users found" message="Try a different search term." icon="👤" />
      ) : (
        <div className="users-grid">
          {filteredUsers.map(user => <UserCard key={user.id} user={user} />)}
        </div>
      )}
    </div>
  );
}
