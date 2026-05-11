import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page fade-in not-found-page">
      <span className="not-found-code">404</span>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}
