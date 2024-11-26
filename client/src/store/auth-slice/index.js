import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  isAuthenticated: false,
  isVerified: false,
  isLoggedIn: false,
  isLoading: true,
  isAdmin: false,
  isLoadingAuth: false,
  isLoadingAdmin: false,
  user: null,
};

// Async action to register a user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData) => {
    const response = await axios.post(
      `${BACKEND_URL}/signup`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const resendotp = createAsyncThunk(
  "resendotp",
  async (formData) => {
    const response = await axios.post(`${BACKEND_URL}/resendOTP`,formData,
      {
        withCredentials:true
      }
    );
    return response.data;
  }
)

// Async action to log in a user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData) => {
    const response = await axios.post(`${BACKEND_URL}/login`, formData, {
      withCredentials: true,
    });
    return response.data;
  }
);

// Async action to handle forgot password action
export const forgotpassword = createAsyncThunk(
  "auth/forgotpassword",
  async (formData) => {
    const response = await axios.post(
      `${BACKEND_URL}/forgotpassword`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Async action to handle creation of new password
export const newpassword = createAsyncThunk(
  "auth/newpassword",
  async (formData) => {
    const response = await axios.post(
      `${BACKEND_URL}/newpassword`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Async action to handle creation of new password when google login is used for the first time
export const newgooglepassword = createAsyncThunk(
  "auth/newgooglepassword",
  async (formData) => {
    const response = await axios.post(
      `${BACKEND_URL}/password`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Async action to verify OTP
export const verifyOtpAction = createAsyncThunk(
  "auth/verifyOtpAction",
  async (formData) => {
    const response = await axios.post(
      `${BACKEND_URL}/verifyOTP`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Async action to log out a user
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  const response = await axios.get(
    `${BACKEND_URL}/auth/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
});

// Async action to check user authentication status
export const checkAuth = createAsyncThunk(
  "/checkAuth",
  async (_, { rejectwithvalue }) => {
    const response = await axios.get(`${BACKEND_URL}/check-auth`, {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
    return response.data;
  }
);

export const checkAdmin = createAsyncThunk(
  "/checkAdmin",
  async (_, { rejectwithvalue }) => {
    const response = await axios.get(`${BACKEND_URL}/check-admin`, {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
    return response.data;
  }
);

export const createPet = createAsyncThunk(
  "/admin/createPet",
  async (formData) => {
    const response = await axios.post(
      `${BACKEND_URL}/happytails/api/pets`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
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
      state.isAdmin = action.payload.isAdmin;
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
        state.isAdmin = false;
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
        state.isAdmin = false;
      })
      .addCase(verifyOtpAction.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })

      .addCase(resendotp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendotp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.isAdmin = false;
      })
      .addCase(resendotp.rejected, (state) => {
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
        state.isAdmin = action.payload.user?.admin;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })

      // Check Authentication Cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.isLoadingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingAuth = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = true;
        state.isVerified = true;
        state.isLoggedIn = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isLoadingAuth = false;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.user = null;
      })

      .addCase(checkAdmin.pending, (state) => {
        state.isLoading = true;
        state.isLoadingAdmin = true;
      })
      .addCase(checkAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingAdmin = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAdmin = action.payload.success;
      })
      .addCase(checkAdmin.rejected, (state) => {
        state.isAdmin = false;
        state.isLoading = false;
        state.isLoadingAdmin = false;
      })

      // Logout User Cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.isAdmin = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.isAdmin = false;
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
        state.isAdmin = false;
      })
      .addCase(newpassword.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.isAdmin = false;
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
        state.isAdmin = false;
      })
      .addCase(forgotpassword.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export const { setUser, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
