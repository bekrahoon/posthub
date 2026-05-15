import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all posts
router.get('/', (req, res) => {
  try {
    const posts = db.getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get post by ID
router.get('/:id', (req, res) => {
  try {
    const post = db.getPostById(Number(req.params.id));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get posts by user
router.get('/user/:userId', (req, res) => {
  try {
    const posts = db.getPostsByUserId(Number(req.params.userId));
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create post
router.post('/', (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    const post = db.createPost(
      { title, body },
      req.user.id
    );

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update post
router.put('/:id', (req, res) => {
  try {
    const { title, body } = req.body;
    const post = db.getPostById(Number(req.params.id));

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check authorization
    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }

    const updated = db.updatePost(Number(req.params.id), { title, body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete post
router.delete('/:id', (req, res) => {
  try {
    const post = db.getPostById(Number(req.params.id));

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check authorization
    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    db.deletePost(Number(req.params.id));
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
