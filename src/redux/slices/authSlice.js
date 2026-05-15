import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// ─── Async Thunks ──────────────────────────────────────────────────────────────

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await api.register(data);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    localStorage.setItem('authToken', response.token);
    return response.user;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const response = await api.login(data);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    localStorage.setItem('authToken', response.token);
    return response.user;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

// ─── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('authToken') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.token = localStorage.getItem('authToken'); })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

    // Login
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.token = localStorage.getItem('authToken'); })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
