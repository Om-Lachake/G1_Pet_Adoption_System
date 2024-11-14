import React, { Fragment, useState } from 'react';
import CommonForm from "../../components/common/form"
import { addPetFormElements } from '../../config/index';
import {X} from 'lucide-react'
import PetImageUpload from '../../components/admin-view/image-upload';
// Custom Sheet component
const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "flex" : "hidden"}`}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );
};

// Custom SheetContent component with slide-in from the right using `right-0`
const SheetContent = ({ side, className, children, open }) => {
  return (
    <div
      className={`bg-white shadow-lg h-full ${className} transition-all duration-300 ease-in-out fixed top-0 right-0`}
      style={{
        width: "350px", // Adjust the width of the sidebar
        right: open ? "0" : "-100%", // Sidebar initially off-screen to the right
      }}
      onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
    >
      {children}
    </div>
  );
};

// Custom SheetHeader component with X button
const SheetHeader = ({ className, children, onClose }) => {
  return (
    <div className={`p-4 ${className} relative`}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 border-2 border-muted p-2 rounded-full hover:border-gray-500 focus:outline-none"
      >
        <span className="text-muted font-bold"><X size={13} /></span>
      </button>
      {children}
    </div>
  );
};

// Custom SheetTitle component
const SheetTitle = ({ children, className }) => {
  return <div className={`flex items-center ${className}`}>{children}</div>;
};

const initialFormData = {
  age:'',
  name:'',
  type:'',
  description:'',
  gender:'',
 

}
const AdminProducts = () => {
  const [openAddPetDialog, setOpenAddPetDialog] = useState(false);
  const [formData,setFormData] = useState(initialFormData);
  const [imageFile,setImageFile] = useState(null);
  const [uploadedImageURL,setUploadedImageURL] = useState('');
  
  function onSubmit(){}
  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <button
          onClick={() => setOpenAddPetDialog(true)}
          className="mt-3 w-fit h-fit bg-blue-500 text-white inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow gap-2"
        >
          Add New Pet
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"></div>

      {/* Sheet (Sidebar) for adding new pet */}
      <Sheet open={openAddPetDialog} onOpenChange={() => setOpenAddPetDialog(false)}>
        <SheetContent side="right" className="overflow-auto" open={openAddPetDialog}>
          <SheetHeader onClose={() => setOpenAddPetDialog(false)}>
            <SheetTitle>Add New Pet</SheetTitle>
          </SheetHeader>
          <PetImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageURL={uploadedImageURL} setUploadedImageURL={setUploadedImageURL} />
          <div className="p-6">
            <CommonForm 
            formControls={addPetFormElements}
            formData={formData}
            setFormData={setFormData}
            ButtonText="Add" 
            onSubmit={onSubmit}
            bgColor="bg-white"
            borderColor='border-zinc-400'
            iconKeep = 'false'
            textColor='text-black'
            placeHolderColor="placeholder-zinc-900" />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProducts;
