import React from 'react'
import Input from "../ui/Input"
import TextArea from "../ui/Textarea"
import {  Lock, Mail, User,Pen } from "lucide-react";
import { FaGoogle } from 'react-icons/fa'; 
import {motion} from 'framer-motion'



const CommonForm = ({formControls ,formData, setFormData, onSubmit, ButtonText}) => {
    function chooseIcon(getControlItem){
        switch(getControlItem.type){
            case 'password':
                return Lock
            break;
            case 'email':
                return Mail
            break;
            default:
                return User
            break;
        }
    }

    function renderInputsByComponentType(getControlItem){
        let element = null;
        const value = formData[getControlItem.name] || '';
        switch(getControlItem.componentType){
            case 'input':
                element = <Input icon={chooseIcon(getControlItem)}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                type={getControlItem.type}
                value={value}
                onChange={(event) =>
                    setFormData({
                      ...formData,
                      [getControlItem.name]: event.target.value,
                    })
                  } />
            break;
            case 'textarea':
                element = <TextArea icon={Pen}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                type={getControlItem.type}
                value={value}
                onChange={(event) =>
                    setFormData({
                      ...formData,
                      [getControlItem.name]: event.target.value,
                    })
                  }
                   />
            break;
            default:
                element = <Input icon={chooseIcon(getControlItem.type)}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                type={getControlItem.type}
                value={value}
                
                onChange={(event) =>
                    setFormData({
                      ...formData,
                      [getControlItem.name]: event.target.value,
                    })
                  } />
            break;
        }
        return element
    }
  return (
    <form onSubmit={onSubmit}>
        
            <div className='flex flex-col gap-3 '>
                {
                    formControls.map(controlItem => <div className='grid w-full gap-1.5' key={controlItem.name} >
                        <div className=" text-transform: capitalize ">{controlItem.label}</div>
                        {
                            renderInputsByComponentType(controlItem)
                        }
                    </div> )
                }
            <button
                className='mt-4 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-[#1DC6DD] text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-700 transition duration-200 flex items-center justify-center gap-2'
                
                type='submit'
            >
                {(ButtonText === "Sign up with Google" || ButtonText === "Log in with Google") && (
                    <FaGoogle size={20} className="mr-2" />
                )}
                {ButtonText || 'Submit'}    
            </button>
            </div>
    </form>
  )
}

export default CommonForm