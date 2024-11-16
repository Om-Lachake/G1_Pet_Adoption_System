import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { verifyOtpAction, setUser, logoutUser } from '../../store/auth-slice' // Import the necessary actions
import Cookies from 'js-cookie'
import axios from 'axios';
import ShoppingHeader from './header'

const Home = () => {
  const initialState = { email: '', OTP: '' }
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Function to handle logout
  const handleLogout = async () => {

    await axios.get("http://localhost:3000/auth/logout", { withCredentials: true });
    dispatch(logoutUser());
    // Clear the cookie
    const clearAllCookies = () => {
      document.cookie.split(";").forEach(cookie => {
        const name = cookie.split("=")[0].trim();
        document.cookie = '${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; 
      });
    };
    
    // Usage
    clearAllCookies();
    
    // Cookies.remove("uid", { path: '/' });
    // Cookies.remove("aid", { path: '/'});
    toast.success("Logged out successfully!");
    navigate('/login');
    
  };

  return (
    <div>
      {/* Logout button */}
      <ShoppingHeader></ShoppingHeader>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home;
