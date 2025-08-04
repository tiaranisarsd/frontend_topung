import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Middleware untuk otomatis set token di setiap request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const LoginUser = createAsyncThunk(
  "auth/LoginUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post("${process.env.REACT_APP_API_URL}/login", userData);
      const { token, ...user } = response.data;
      localStorage.setItem("token", token); 
      return user;
    } catch (error) {
      const message = error.response?.data?.msg || "Terjadi kesalahan saat login";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
  try {
    const response = await axios.get("${process.env.REACT_APP_API_URL}/me");
    return response.data;
  } catch (error) {
    const message = "Mohon login ke akun Anda";
    return thunkAPI.rejectWithValue(message);
  }
});

export const LogOut = createAsyncThunk("auth/LogOut", async (_, thunkAPI) => {
  try {
    await axios.delete("${process.env.REACT_APP_API_URL}/logout");
    localStorage.removeItem("token");
  } catch (error) {
    const message = error.response?.data?.msg || "Terjadi kesalahan saat logout";
    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
        state.message = "Login berhasil";
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.users = null;
      })
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.users = null;
      })
      .addCase(LogOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LogOut.fulfilled, (state) => {
        state.isLoading = false;
        state.users = null;
        state.isSuccess = false;
        state.isError = false;
        state.message = "Logout berhasil";
      })
      .addCase(LogOut.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
