import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// ─── Async Thunks ──────────────────────────────────────────────────────────────

export const loadUsers = createAsyncThunk('users/loadAll', async (_, { rejectWithValue }) => {
  try { return await api.fetchAllUsers(); }
  catch (e) { return rejectWithValue(e.message); }
});

export const loadUserById = createAsyncThunk('users/loadOne', async (id, { rejectWithValue }) => {
  try { return await api.fetchUserById(id); }
  catch (e) { return rejectWithValue(e.message); }
});

// ─── Slice ─────────────────────────────────────────────────────────────────────

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    currentUser: null,
    loading: false,
    error: null,
    searchQuery: '',
  },
  reducers: {
    setUserSearch(state, action) { state.searchQuery = action.payload; },
    clearCurrentUser(state) { state.currentUser = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(loadUsers.fulfilled,(s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(loadUsers.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(loadUserById.pending,  (s) => { s.loading = true;  s.error = null; })
      .addCase(loadUserById.fulfilled,(s, a) => { s.loading = false; s.currentUser = a.payload; })
      .addCase(loadUserById.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectFilteredUsers = (state) => {
  const { items, searchQuery } = state.users;
  if (!searchQuery.trim()) return items;
  const q = searchQuery.toLowerCase();
  return items.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.username.toLowerCase().includes(q)
  );
};

export const { setUserSearch, clearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
