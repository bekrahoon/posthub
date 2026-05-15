import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// ─── Async Thunks ──────────────────────────────────────────────────────────────

export const loadPosts = createAsyncThunk('posts/loadAll', async (_, { rejectWithValue }) => {
  try { return await api.fetchAllPosts(); }
  catch (e) { return rejectWithValue(e.message); }
});

export const loadPostById = createAsyncThunk('posts/loadOne', async (id, { rejectWithValue }) => {
  try { return await api.fetchPostById(id); }
  catch (e) { return rejectWithValue(e.message); }
});

export const loadPostsByUser = createAsyncThunk('posts/loadByUser', async (userId, { rejectWithValue }) => {
  try { return await api.fetchPostsByUser(userId); }
  catch (e) { return rejectWithValue(e.message); }
});

export const addPost = createAsyncThunk('posts/add', async (data, { rejectWithValue }) => {
  try { return await api.createPost(data); }
  catch (e) { return rejectWithValue(e.message); }
});

export const editPost = createAsyncThunk('posts/edit', async ({ id, data }, { rejectWithValue }) => {
  try { return await api.updatePost(id, data); }
  catch (e) { return rejectWithValue(e.message); }
});

export const removePost = createAsyncThunk('posts/remove', async (id, { rejectWithValue }) => {
  try { await api.deletePost(id); return id; }
  catch (e) { return rejectWithValue(e.message); }
});

// ─── Slice ─────────────────────────────────────────────────────────────────────

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    currentPost: null,
    userPosts: [],
    loading: false,
    error: null,
    searchQuery: '',
    filterUserId: null,
    sortBy: 'id',
  },
  reducers: {
    setSearchQuery(state, action) { state.searchQuery = action.payload; },
    setFilterUserId(state, action) { state.filterUserId = action.payload; },
    setSortBy(state, action) { state.sortBy = action.payload; },
    clearCurrentPost(state) { state.currentPost = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    // loadPosts
    builder
      .addCase(loadPosts.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(loadPosts.fulfilled,(s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(loadPosts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

    // loadPostById
      .addCase(loadPostById.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(loadPostById.fulfilled,(s, a) => { s.loading = false; s.currentPost = a.payload; })
      .addCase(loadPostById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

    // loadPostsByUser
      .addCase(loadPostsByUser.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(loadPostsByUser.fulfilled,(s, a) => { s.loading = false; s.userPosts = a.payload; })
      .addCase(loadPostsByUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

    // addPost
      .addCase(addPost.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(addPost.fulfilled,(s, a) => { s.loading = false; s.items.unshift(a.payload); })
      .addCase(addPost.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

    // editPost
      .addCase(editPost.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(editPost.fulfilled,(s, a) => {
        s.loading = false;
        const idx = s.items.findIndex(p => p.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
        if (s.currentPost?.id === a.payload.id) s.currentPost = a.payload;
      })
      .addCase(editPost.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

    // removePost
      .addCase(removePost.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(removePost.fulfilled,(s, a) => {
        s.loading = false;
        s.items = s.items.filter(p => p.id !== a.payload);
      })
      .addCase(removePost.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectFilteredPosts = (state) => {
  const { items, searchQuery, filterUserId, sortBy } = state.posts;
  let result = [...items];
  if (filterUserId) result = result.filter(p => p.userId === Number(filterUserId));
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
    );
  }
  return result.sort((a, b) => {
    if (sortBy === 'id') return b.id - a.id;
    if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });
};

export const { setSearchQuery, setFilterUserId, setSortBy, clearCurrentPost, clearError } = postsSlice.actions;
export default postsSlice.reducer;
