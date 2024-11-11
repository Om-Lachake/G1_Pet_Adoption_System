import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isVerified: false,
  isLoggedIn:false,
  isLoading: true,
  user: null,
};

// Async action to register a user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:3000/signup",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Async action to log in a user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:3000/login",
      formData,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data;
  }
);

// Async action to handle forgot password action
export const forgotpassword = createAsyncThunk(
  "auth/forgotpassword",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:3000/forgotpassword",
      formData,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data;
  }
);

// Async action to handle creation of new password
export const newpassword = createAsyncThunk(
  "auth/newpassword",
  async (formData) => {
    console.log(formData)
    const response = await axios.post(
      "http://localhost:3000/newpassword",
      formData,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data;
  }
);

// Async action to handle creation of new password when google login is used for the first time 
export const newgooglepassword = createAsyncThunk(
  "auth/newgooglepassword",
  async (formData) => {
    console.log(formData)
    const response = await axios.post(
      "http://localhost:3000/password",
      formData,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data;
  }
);

// Async action to verify OTP
export const verifyOtpAction = createAsyncThunk(
  "auth/verifyOtpAction",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:3000/verifyOTP",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Async action to log out a user
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    const response = await axios.get(
      "http://localhost:3000/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Async action to check user authentication status
export const checkAuth = createAsyncThunk(
  "/checkAuth",
  async (_,{rejectwithvalue}) => {
    const response = await axios.get(
      "http://localhost:3000/check-auth",
      {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
    return response.data;
  }
);
 
// set variable based on action
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isVerified = action.payload.isVerified;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User Cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = action.payload.success;
        state.isVerified = false; // User still needs to verify OTP
        state.isLoggedIn = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })

      // Verify OTP Cases
      .addCase(verifyOtpAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOtpAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.success;
        state.isVerified = action.payload.success;
        state.isLoggedIn = false;
      })
      .addCase(verifyOtpAction.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })

      // Login User Cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.isVerified = action.payload.success;
        state.isLoggedIn = action.payload.success; 
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })

      // Check Authentication Cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.isVerified = action.payload.success;
        state.isLoggedIn = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.user = null;
      })

      // Logout User Cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.user = null;
      })
      //new password cases
      .addCase(newpassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(newpassword.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = true;
        state.isVerified = true;
        state.isLoggedIn = false;
      })
      .addCase(newpassword.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.user = null;
      })
      //new google password cases
      .addCase(newgooglepassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(newgooglepassword.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = true;
        state.isVerified = true;
        state.isLoggedIn = true;
      })
      .addCase(newgooglepassword.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.user = null;
      })
      //forgot password cases
      .addCase(forgotpassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotpassword.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = true;
        state.isVerified = true;
        state.isLoggedIn = false;
      })
      .addCase(forgotpassword.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.user = null;
      })
  },
});

export const { setUser,setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
