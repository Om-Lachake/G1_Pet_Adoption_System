import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommonForm from '../../components/common/form';
import { registerFormControls, loginGoogleControls } from '../../config';
import { registerUser, setAuthenticated } from '../../store/auth-slice';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const initialState = {//state initialize
  username: "",
  email: "",
  password: "",
};

function isStrongPassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return strongPasswordRegex.test(password);
}

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const [passwordStrength, setPasswordStrength] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    if (isStrongPassword(password)) {
      setPasswordStrength("strong");
    } else {
      setPasswordStrength("weak");
    }
  };

  const onSubmit = (event) => {//function to handle sign up
    event.preventDefault();
    if (!formData.email || !formData.password || !formData.username) {
      toast.error("Please enter all the details");
      return; // Exit early if validation fails
    }
    if (passwordStrength !== "strong") {
      toast.error("Password must be strong: 8+ characters, uppercase, lowercase, number, and special character.");
      return;
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
      `${BACKEND_URL}/auth/google`,
      "_blank",
      "width=500,height=600"
    );

    // Listen for the message from the backend
    window.addEventListener("message", (event) => {
      if (event.origin !== `${BACKEND_URL}`) return;  // Only accept messages from your backend origin
    
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
        setFormData={(updatedFormData) => {
          setFormData(updatedFormData);
          if (updatedFormData.password) {
            checkPasswordStrength(updatedFormData.password); 
          }
        }}

        onSubmit={onSubmit}
      />


      {formData.password && (
        <p className={`mt-1 text-sm ${passwordStrength === "strong" ? "text-green-500" : "text-red-500"}`}>
          Password strength: {passwordStrength === "strong" ? "Strong" : "Weak"}
        </p>
      )}
      
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
