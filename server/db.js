// In-memory database
let users = [
  { id: 1, username: 'john_doe', email: 'john@example.com', name: 'John Doe', password: '$2a$10$...' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', name: 'Jane Smith', password: '$2a$10$...' },
];

let posts = [
  { id: 1, userId: 1, title: 'First Post', body: 'This is the first post content', createdAt: new Date() },
  { id: 2, userId: 2, title: 'Second Post', body: 'This is the second post content', createdAt: new Date() },
];

let nextUserId = 3;
let nextPostId = 3;

// User operations
export const db = {
  // Users
  getAllUsers: () => users.map(({ password, ...u }) => u),
  getUserById: (id) => {
    const user = users.find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },
  getUserByUsername: (username) => users.find(u => u.username === username),
  getUserByEmail: (email) => users.find(u => u.email === email),
  createUser: (userData) => {
    const newUser = {
      id: nextUserId++,
      ...userData,
      createdAt: new Date(),
    };
    users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Posts
  getAllPosts: () => posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  getPostById: (id) => posts.find(p => p.id === id),
  getPostsByUserId: (userId) => posts.filter(p => p.userId === userId),
  createPost: (postData, userId) => {
    const newPost = {
      id: nextPostId++,
      userId,
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    posts.push(newPost);
    return newPost;
  },
  updatePost: (id, postData) => {
    const post = posts.find(p => p.id === id);
    if (!post) return null;
    const updated = { ...post, ...postData, updatedAt: new Date() };
    const index = posts.findIndex(p => p.id === id);
    posts[index] = updated;
    return updated;
  },
  deletePost: (id) => {
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts.splice(index, 1);
      return true;
    }
    return false;
  },
};
