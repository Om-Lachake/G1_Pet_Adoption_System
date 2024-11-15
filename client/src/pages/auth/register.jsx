import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommonForm from '../../components/common/form';
import { registerFormControls, loginGoogleControls } from '../../config';
import { registerUser, setAuthenticated } from '../../store/auth-slice';

const initialState = {//state initialize
  username: "",
  email: "",
  password: "",
};

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (event) => {//function to handle sign up
    event.preventDefault();
    if (!formData.email || !formData.password || !formData.username) {
      toast.error("Please enter all the details");
      return; // Exit early if validation fails
    }
    dispatch(registerUser(formData))
      .then((data) => {
        if (data?.payload?.success) {
          toast(data?.payload?.message);
          navigate("/verifyOTP");  // Redirect to OTP verification page
        } else {
          toast(data?.payload?.message);
        }
      });
  };

  const onSubmitGoogle = (event) => {//function to handle signup with google
    event.preventDefault();

    // Open Google OAuth URL in a new window
    const authWindow = window.open(
      "http://localhost:3000/auth/google",
      "_blank",
      "width=500,height=600"
    );

    // Listen for the message from the backend
    window.addEventListener("message", (event) => {
      if (event.origin !== "http://localhost:3000") return;  // Only accept messages from your backend origin
    
      const { success, firsttime, message, token,atoken, isadmin } = event.data;
      console.log("eventdata after login",event.data)
      if (success) {
        // Store the token in localStorage
        if (token) {
          document.cookie = `uid=${token}; path=/; SameSite=Strict;`;
          console.log("boolean",isadmin)
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
                navigate("/admin/dashboard");
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
  };

  return (//HTML for page
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new Account</h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        ButtonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <CommonForm
        formControls={loginGoogleControls}
        ButtonText={"Sign up with Google"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmitGoogle} // Use onSubmitGoogle for Google login
      />
    </div>
  );
};

export default AuthRegister;
