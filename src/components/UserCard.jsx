import { Link } from 'react-router-dom';
import { Avatar } from './UI';

export default function UserCard({ user }) {
  return (
    <Link to={`/users/${user.id}`} className="user-card">
      <Avatar name={user.name} id={user.id} size={52} />
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-username">@{user.username}</p>
        <p className="user-detail">✉ {user.email}</p>
        <p className="user-detail">🌐 {user.website}</p>
        <p className="user-detail">🏢 {user.company?.name}</p>
      </div>
      <span className="user-card-arrow">→</span>
    </Link>
  );
}
