import React from 'react'
import {HomeIcon, Menu} from 'lucide-react'
import {LogOut} from 'lucide-react'
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { verifyOtpAction, setUser, logoutUser } from '../../store/auth-slice'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminHeader = ({setOpen}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async () => {
    // Dispatch the logout action to reset the Redux state
    await axios.get(`${BACKEND_URL}/auth/logout`, { withCredentials: true });
    dispatch(logoutUser());
    // Clear the cookie
    const clearAllCookies = () => {
      document.cookie.split(";").forEach(cookie => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    };
    
    // Usage
    clearAllCookies();
    toast.success("Logged out successfully!");
    navigate('/login');
  };
  const handleHome = async () => {
    // Dispatch the logout action to reset the Redux state
    navigate('/pet/home');
  };
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#F9F9FA] border-b" >
      <button onClick={()=>setOpen(true)} className='lg:hidden small:block mt-4 w-fit  bg-blue-500 text-white  inline-flex items-center rounded-md px-3 py-2 text-sm font-medium shadow gap-2' >
      <Menu size={15} />
      <span className='sr-only'>Toggle Menu</span>
      </button>
      <div className='flex flex-1 justify-end items-center pb-3'>
        <button onClick={handleHome} className=' mt-4 mx-2 w-fit  bg-blue-500 text-white  inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow gap-4 ' >
          <HomeIcon/>
            Home
          </button>
        <button onClick={handleLogout} className=' mt-4 mx-2 w-fit  bg-blue-500 text-white  inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow gap-2' >
          <LogOut />
            Logout
          </button>
      </div>
    </header>
  )
}

export default AdminHeader
