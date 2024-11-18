import React, { useEffect, useState } from "react";
import axios from "axios";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import {motion} from "framer-motion";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const PetTile = ({ pet, onDelete, onEdit }) => {
  return (
    <div>
      <motion.div
      className="w-full max-w-sm mx-auto bg-[#f0f4f8] pb-2 rounded-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      <div>
        <div className="relative">
          <motion.img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 mt-4 pl-3 text-[#013756]">{pet.name}</h2>
          <div className="flex justify-between items-center mb-4 pl-3 mt-4">
            <span className="text-sm font-semibold text-primary text-[#013756] ">
            {pet.description}
            </span>
          </div>
        </div>
        <div className="flex px-2 justify-between items-center mx-3 mb-2">
          <motion.button
            className="px-3 py-1 bg-green-500 rounded-md flex items-center gap-2 justify-between"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(pet)}
          >
            <MdEdit className="text-xl text-zinc-100" />
            <div className="text-zinc-100" > Edit</div>
            
          </motion.button>
          <motion.button
            className="px-3 py-1 bg-red-500 rounded-md flex items-center gap-2 justify-between"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(pet._id)}
          >
            <MdDelete className="text-xl text-zinc-100" />
            <div className="text-zinc-100" > Delete</div>
          </motion.button>
        </div>
      </div>
    </motion.div>

    </div> 
  );
};

const AdminPetTile = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editPet, setEditPet] = useState(null); // State for the pet being edited
  const [updatedPet, setUpdatedPet] = useState({
    name: "",
    description: "",
    file: null, // Changed to store file object
  }); // State for updated pet data

  useEffect(() => {
    const fetchPetsAndForms = async () => {
      setIsLoading(true);
  
      try {
        // Fetch pets
        const petsResponse = await axios.get(
          `${BACKEND_URL}/happytails/api/pets`,
          { withCredentials: true }
        );
  
        // Fetch forms with all statuses
        const formsResponse = await axios.get(
          `${BACKEND_URL}/happytails/apply/getForm`,
          { withCredentials: true }
        );
  
        const forms = formsResponse.data.forms;
  
        // Filter out pets with an approved form
        const filteredPets = petsResponse.data.pets.filter(
          (pet) => !forms.some((form) => form.petid === pet._id && form.status === "approved")
        );
  
        setPets(filteredPets);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPetsAndForms();
  }, []);

  const handleDeletePet = async (petId) => {
    // Optimistic UI update: remove pet immediately
    const updatedPets = pets.filter((pet) => pet._id !== petId);
    setPets(updatedPets);

    try {
      // Send delete request to the server
      const response = await axios.delete(
        `${BACKEND_URL}/happytails/api/pets/${petId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Pet deleted successfully!");
      } else {
        throw new Error("Failed to delete pet");
      }
    } catch (error) {
      // If error occurs, revert the optimistic update
      setPets(pets); // Restore original pets list
      toast.error("Error deleting the pet!");
      console.error("Error deleting pet:", error);
    }
  };

  const handleEditPet = (pet) => {
    setEditPet(pet);
    setUpdatedPet({
      name: pet.name,
      age: pet.age,
      type: pet.type,
      description: pet.description,
      imageFile: null, // Reset the image file for editing
    });
  };

  const handleUpdatePet = async () => {
    const formData = new FormData();
    formData.append("name", updatedPet.name);
    formData.append("description", updatedPet.description);
    formData.append("age", updatedPet.age);
    formData.append("type", updatedPet.type);
    if (updatedPet.image) {
      formData.append("file", updatedPet.image);
    }

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/happytails/api/pets/${editPet._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update pet in state after successful update
        setPets((prevPets) =>
          prevPets.map((pet) =>
            pet._id === editPet._id
              ? { ...pet, ...updatedPet, imageUrl: response.data.imageUrl }
              : pet
          )
        );
        setEditPet(null); // Close the edit form
        window.location.reload();
      } else {
        throw new Error("Failed to update pet");
      }
    } catch (error) {
      toast.error("Error updating the pet!");
      console.error("Error updating pet:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ClimbingBoxLoader color={"#2563eb"} loading={isLoading} size={30} />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-10 p-4 w-full">
      {pets.map((pet) => (
        <PetTile
          key={pet._id}
          pet={pet}
          onDelete={handleDeletePet}
          onEdit={handleEditPet}
        />
      ))}

      {/* Update Pet Form */}
      {editPet && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Edit Pet</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                value={updatedPet.name}
                onChange={(e) =>
                  setUpdatedPet({ ...updatedPet, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Age</label>
              <input
                type="text"
                value={updatedPet.age}
                onChange={(e) =>
                  setUpdatedPet({ ...updatedPet, age: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Type</label>
              <input
                type="text"
                value={updatedPet.type}
                onChange={(e) =>
                  setUpdatedPet({ ...updatedPet, type: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <input
                type="text"
                value={updatedPet.description}
                onChange={(e) =>
                  setUpdatedPet({ ...updatedPet, description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Image</label>
              <input
                type="file"
                onChange={(e) =>
                  setUpdatedPet({ ...updatedPet, image: e.target.files[0] })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setEditPet(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePet}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Update Pet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPetTile;
