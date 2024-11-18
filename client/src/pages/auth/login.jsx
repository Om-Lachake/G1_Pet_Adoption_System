import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Link, useNavigate, Navigate } from "react-router-dom"; 
import {  toast } from 'react-toastify';
import CommonForm from '../../components/common/form';
import { loginFormControls, loginGoogleControls } from '../../config';
import { loginUser } from '../../store/auth-slice';
import { setAuthenticated } from '../../store/auth-slice';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const initialState = {//initialize state 
  email: "",
  password: "",
};
const AuthLogin = () => {

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  function onSubmit(event) { //function to handle login
    event.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.");
      return; // Exit early if validation fails
    }

    dispatch(loginUser(formData)).then((data) => {//send request to backend
      if (data?.payload?.success) {
        toast(data?.payload?.message)
        if(data?.payload?.user?.admin) {
          navigate("/admin/pets")
        } else {
          navigate("/shop/home")
        }
      } else {
        if(data.payload.message === "User is not verified") {
          navigate("/resendOTP")
        } else {
          toast(data?.payload?.message);
        }
        
      }
    });
  }
  function onSubmitGoogle(event) { //function to handle google login
      event.preventDefault();

    // Open Google OAuth URL in a new window
    const authWindow = window.open(//open google oauth window
      `${BACKEND_URL}/auth/google`,
      "_blank",
      "width=500,height=600"
    );

    // Listen for the message from the backend
    window.addEventListener("message", (event) => {
      if (event.origin !== `${BACKEND_URL}`) return;  // Only accept messages from your backend origin
    
      const { success, firsttime, message, token,atoken, isadmin,user } = event.data;
      console.log("eventdata after login",event.data)
      if (success) {
        // Store the token in localStorage
        if (token) {
          document.cookie = `uid=${token}; path=/; SameSite=Strict;`;
          if (!firsttime) { //if not first time send redirect to home 
            if(isadmin) {
              document.cookie = `aid=${atoken}; path=/; SameSite=Strict;`;
              dispatch(setAuthenticated({ 
                isAuthenticated: true, 
                isVerified: true, 
                isLoggedIn: true,
                isAdmin: true 
              }));
              setTimeout(() => {
                navigate("/admin/pets");
              }, 50);
            } else {
              dispatch(setAuthenticated({ 
                isAuthenticated: true, 
                isVerified: true, 
                isLoggedIn: true,
                isAdmin: false, 
              }));
              navigate("/shop/home");
            }
          } else {
            dispatch(setAuthenticated({ //if first time then send to create a password first
              isAuthenticated: true, 
              isVerified: true, 
              isLoggedIn: false,
              isAdmin: false 
            }));
            navigate("/googleAuthPassword");
          }
        }
      } else {
        console.log("faill")
        toast("Authentication failed");
      }
      // Close the auth window
      authWindow.close();
    });
    
  }

  return (//HTML for page
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className="text-center ">
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Sign In to your Account </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/signup"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
      formControls={loginFormControls}
      ButtonText={"Sign In"}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      />
      
      <CommonForm
      
      formControls={loginGoogleControls}
      ButtonText={"Log in with Google"}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmitGoogle}
      />
      <Link
        style={{ display: 'block', textAlign: 'center', width: '100%' }}
        className="font-medium ml-2 text-primary hover:underline"
        to="/forgotpassword"
      >
        Forgot Password?
      </Link>
      
    </div>
  );
}

export default AuthLogin
