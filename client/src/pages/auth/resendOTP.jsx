import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Link, useNavigate, Navigate } from "react-router-dom"; 
import {  toast } from 'react-toastify';
import { forgotPasswordControls } from '../../config';
import { resendotp } from '../../store/auth-slice';
import CommonForm from '../../components/common/form';
const initialState = {//state initialization 
    email: "",
};
const ResendOTP = () => {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    function onSubmit(event) {//function to handle forgot password
        event.preventDefault();
        if (!formData.email) {
          toast.error("Please enter email");
          return; // Exit early if validation fails
        }
    
        dispatch(resendotp(formData)).then((data) => {//send request to backend
          if (data?.payload?.success) {
            toast(data?.payload?.message)
            navigate("/verifyOTP") //next page if success
          } else {
            toast(data?.payload?.message);
          }
        });
      }

    return (//HTML for page
        <div className='mx-auto w-full max-w-md space-y-6'>
          <div className="text-center ">
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>To get Verification OTP</h1>
            <p className="mt-2">
              Enter e-mail
            </p>
          </div>
          <CommonForm
          formControls={forgotPasswordControls}
          ButtonText={"Receive OTP"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          />
          
        </div>
      );
}
export default ResendOTP