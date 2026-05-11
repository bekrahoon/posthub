export const truncate = (str, max = 100) =>
  str.length <= max ? str : str.slice(0, max).trimEnd() + '…';

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const getUserInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

export const getAvatarColor = (id) => {
  const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6'];
  return colors[id % colors.length];
};
