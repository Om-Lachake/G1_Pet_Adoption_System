import React, { useState } from 'react'
import Input from "../ui/Input"
import TextArea from "../ui/Textarea"
import {  Lock, Mail, User,Pen } from "lucide-react";
import { FaGoogle } from 'react-icons/fa'; 
import {motion} from 'framer-motion'



const CommonForm = ({formControls ,formData, setFormData, onSubmit, ButtonText,bgColor, placeHolderColor,borderColor,iconKeep,textColor}) => {

  function chooseIcon(getControlItem){
    switch(getControlItem.type){
        case 'password':
            return Lock
        break;
        case 'email':
            return Mail
        break;
        case 'number':
          return Pen
        break;
        default:
            return User
        break;
    }
}


const [isOpen, setIsOpen] = useState(false);
const Select = ({ onValueChange, value, children }) => {

  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
    setIsOpen(false); // Close the dropdown after selecting
  };

  return (
    <div className="relative w-full">
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen,
          });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, { onSelect: handleSelect });
        }
        return null;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, onClick, isOpen }) => (
  <button
    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-left flex items-center justify-between cursor-pointer"
    onClick={onClick}
  >
    {children}
    <span className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
      ▼
    </span>
  </button>
);

const SelectValue = ({ placeholder, value }) => (
  <span className={value ? 'text-black' : 'text-gray-500'}>
    {value || placeholder}
  </span>
);

const SelectContent = ({ children, onSelect }) => (
  <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { onSelect })
    )}
  </div>
);

const SelectItem = ({ children, value, onSelect }) => (
  <div
    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
    onClick={() => onSelect(value)}
  >
    {children}
  </div>
);

function renderInputsByComponentType(getControlItem) {
  let element = null;
  const value = formData[getControlItem.name] || '';
  switch (getControlItem.componentType) {
    case 'input':
      element = (
        <Input
          icon={chooseIcon(getControlItem)}
          placeholder={getControlItem.placeholder}
          id={getControlItem.name}
          type={getControlItem.type}
          value={value}
          bgColor={bgColor}
          placeHolderColor={placeHolderColor}
          borderColor={borderColor}
          iconKeep={iconKeep}
          textColor={textColor}
          onChange={(event) =>
            setFormData({
              ...formData,
              [getControlItem.name]: event.target.value,
            })
          }
        />
      );
      break;
    case 'select':
      element = (
        <Select
          onValueChange={(value) =>
            setFormData({
              ...formData,
              [getControlItem.name]: value,
            })
          }
          value={value}
        >
          <SelectTrigger>
            
            <SelectValue placeholder={getControlItem.label} value={value} />
          </SelectTrigger>
          <SelectContent>
            {getControlItem.options && getControlItem.options.length > 0
              ? getControlItem.options.map((optionItem) => (
                  <SelectItem key={optionItem.id} value={optionItem.id}>
                    {optionItem.label}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>
      );
      break;
    case 'textarea':
      element = (
        <TextArea
          icon={Pen}
          placeholder={getControlItem.placeholder}
          id={getControlItem.name}
          type={getControlItem.type}
          value={value}
          bgColor={bgColor}
          borderColor={borderColor}
          iconKeep={iconKeep}
          placeHolderColor={placeHolderColor}
          textColor={textColor}
          onChange={(event) =>
            setFormData({
              ...formData,
              [getControlItem.name]: event.target.value,
            })
          }
        />
      );
      break;
    default:
      element = (
        <Input
          icon={chooseIcon(getControlItem.type)}
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
      );
      break;
  }
  return element;
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
