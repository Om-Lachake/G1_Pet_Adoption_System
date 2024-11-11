import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Link, useNavigate, Navigate } from "react-router-dom"; 
import {  toast } from 'react-toastify';
import { passwordGoogleControls } from '../../config';
import { newgooglepassword } from '../../store/auth-slice';
import CommonForm from '../../components/common/form';
const initialState = {//state initialize
  password:"",
  rpassword:""
};
const GoogleAuthPassword = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  function onSubmit(event) { //function to handle creation of new password after google oauth signup
    event.preventDefault();
    if (!formData.password || !formData.rpassword) {
      toast.error("Please enter all details");
      return; // Exit early if validation fails
    } else if(formData.password !== formData.rpassword) {
        toast.error("passwords do not match")
        return;
    }

    dispatch(newgooglepassword(formData)).then((data) => {//send request to backend
      if (data?.payload?.success) {
        toast(data?.payload?.message)
        navigate("/shop/home") //login once password created
      } else {
        toast(data?.payload?.message);
      }
    });
  }

  return (//HTML for page
    <div className='mx-auto w-full max-w-md space-y-6'>
          <div className="text-center ">
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>You are creating a new Account</h1>
            <p className="mt-2">
               Create a password first and set a Username
            </p>
          </div>
          <CommonForm
          formControls={passwordGoogleControls}
          ButtonText={"Create Account"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          />
          
        </div>
  )
}

export default GoogleAuthPassword