import React, { Fragment, useState } from 'react';
import CommonForm from "../../components/common/form"
import { addPetFormElements } from '../../config/index';
import {X} from 'lucide-react'
import PetImageUpload from '../../components/admin-view/image-upload';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {createPet} from '../../store/auth-slice/index'
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
  imageFile:null,

}
const AdminProducts = () => {
  const [openAddPetDialog, setOpenAddPetDialog] = useState(false);
  const [formData,setFormData] = useState(initialFormData);
  const [imageFile,setImageFile] = useState(null);
  const [uploadedImageURL,setUploadedImageURL] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function onSubmit(event){
    event.preventDefault();
    if (!formData.age || !formData.name || !formData.type ||!formData.description || !formData.gender) {
      toast.error("Please enter all the details");
      return;
    } else {
      //console.log("here");
      const form = new FormData();
      // Append regular form data
      form.append('name', formData.name);
      form.append('type', formData.type);
      form.append('gender', formData.gender);
      form.append('age', formData.age);
      form.append('description', formData.description);
      // Append the image file (this assumes the imageFile is a File object)
      form.append('file', imageFile);
      // for (let [key, value] of form.entries()) {
      //   console.log(key, value);
      // }
      dispatch(createPet(form))
      .then((data) => {
        if (data?.payload?.success) {
          //console.log("here 2")
          toast(data?.payload?.message);
          setFormData(initialFormData);
          setImageFile(null);  // Reset the image file state
          //setOpenAddPetDialog(false);  // Close the form dialog
        } else {
          //console.log("here 3")
          toast(data?.payload?.message);
          console.log(data?.payload?.message);
        }
      });
      
    }
  }
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
