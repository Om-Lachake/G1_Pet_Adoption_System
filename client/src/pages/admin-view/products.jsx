import React, { Fragment, useState, useEffect } from "react";
import CommonForm from "../../components/common/form";
import { addPetFormElements } from "../../config/index";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { X } from "lucide-react";
import axios from "axios";
import PetImageUpload from "../../components/admin-view/image-upload";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPet } from "../../store/auth-slice/index";
import AdminPetTile from "../../components/admin-view/product-tile";
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
        <span className="text-muted font-bold">
          <X size={13} />
        </span>
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
  age: "",
  name: "",
  type: "",
  description: "",
  gender: "",
  imageFile: null,
};
const AdminPets = () => {
  const [openAddPetDialog, setOpenAddPetDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/happytails/api/pets",
          {
            withCredentials: true,
          }
        );
        setPets(response.data.pets);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ClimbingBoxLoader color={"#2563eb"} loading={isLoading} size={30} />
      </div>
    );
  }

  const onSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.age ||
      !formData.name ||
      !formData.type ||
      !formData.description ||
      !formData.gender
    ) {
      toast.error("Please enter all the details");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("type", formData.type);
    form.append("gender", formData.gender);
    form.append("age", formData.age);
    form.append("description", formData.description);
    form.append("file", imageFile);

    dispatch(createPet(form)).then((data) => {
      if (data?.payload?.success) {
        // Add the new pet to the state without re-fetching
        //setPets((prevPets) => [...prevPets, newPet]); // Add the new pet to the list
        setFormData(initialFormData);
        setImageFile(null); // Reset image state
        setOpenAddPetDialog(false);
        window.location.reload(); // Close the form dialog
      } else {
        toast(data?.payload?.message);
        console.error(data?.payload?.message);
      }
    });
  };

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

      <div>
        <AdminPetTile />
      </div>

      {/* Sheet (Sidebar) for adding new pet */}
      <Sheet
        open={openAddPetDialog}
        onOpenChange={() => setOpenAddPetDialog(false)}
      >
        <SheetContent
          side="right"
          className="overflow-auto"
          open={openAddPetDialog}
        >
          <SheetHeader onClose={() => setOpenAddPetDialog(false)}>
            <SheetTitle>Add New Pet</SheetTitle>
          </SheetHeader>
          <PetImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageURL={uploadedImageURL}
            setUploadedImageURL={setUploadedImageURL}
          />
          <div className="p-6">
            <CommonForm
              formControls={addPetFormElements}
              formData={formData}
              setFormData={setFormData}
              ButtonText="Add"
              onSubmit={onSubmit}
              bgColor="bg-white"
              borderColor="border-zinc-400"
              iconKeep="false"
              textColor="text-black"
              placeHolderColor="placeholder-zinc-900"
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminPets;
