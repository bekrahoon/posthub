// LoadingSpinner
export function LoadingSpinner({ size = 'md', text = 'Loading…' }) {
  const s = size === 'lg' ? 48 : size === 'sm' ? 20 : 32;
  return (
    <div className="spinner-wrapper">
      <div className="spinner" style={{ width: s, height: s }} />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}

// ErrorMessage
export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-box error-box">
      <span className="state-icon">⚠️</span>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && <button className="btn btn-primary" onClick={onRetry}>Try again</button>}
    </div>
  );
}

// EmptyState
export function EmptyState({ title = 'Nothing here', message = 'No items found.', icon = '📭' }) {
  return (
    <div className="state-box empty-box">
      <span className="state-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

// Badge
export function Badge({ children, color = 'default' }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}

// Avatar
export function Avatar({ name = '', id = 1, size = 36 }) {
  const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6'];
  const bg = colors[id % colors.length];
  const initials = name.split(' ').slice(0,2).map(w => w[0]?.toUpperCase()).join('');
  return (
    <div className="avatar" style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

// Modal
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
