import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { verifyOTPcontrols } from '../../config'
import { toast } from 'react-toastify'
import CommonForm from '../../components/common/form';
import { verifyOtpAction } from '../../store/auth-slice'

const VerifyOtp = () => { //function to handle verification of OTP
  const initialState = { email: '', OTP: '' }
  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function onSubmit(event) {
    event.preventDefault()
    dispatch(verifyOtpAction(formData)).then((data) => { //send request to backend
      if (data?.payload?.success) {
        toast(data?.payload?.message)
        navigate("/login") // Redirect after successful verification
      } else {
        toast(data?.payload?.message)
      }
    })
  }


  return (//HTML for page 
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className="text-center ">
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Verify Account</h1>
        <p className="mt-2">
          Enter OTP
        </p>
      </div>
      <CommonForm
      formControls={verifyOTPcontrols}
      ButtonText={"Verify"}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      />
    </div>
  )
}

export default VerifyOtp
