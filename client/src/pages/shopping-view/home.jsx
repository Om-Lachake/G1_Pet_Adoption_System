import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { verifyOtpAction, setUser, logoutUser } from '../../store/auth-slice' // Import the necessary actions
import Cookies from 'js-cookie'
import axios from 'axios';

const VerifyOtp = () => {
  const initialState = { email: '', OTP: '' }
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Function to handle logout
  const handleLogout = async () => {
    // Dispatch the logout action to reset the Redux state
    await axios.get("http://localhost:3000/auth/logout", { withCredentials: true });
    dispatch(logoutUser());
    // Clear the cookie
    Cookies.remove("uid", { path: '/' });
    // Show a success message
    toast.success("Logged out successfully!");
    // Redirect the user to the login page
    navigate('/login');
  };

  return (
    <div>
      {/* Logout button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default VerifyOtp
