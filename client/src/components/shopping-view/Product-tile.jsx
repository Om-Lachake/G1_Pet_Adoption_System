import React, { useState } from "react";
import { CalendarArrowUp } from 'lucide-react';
import { motion } from "framer-motion";
import axios from 'axios';
import { toast } from "react-toastify";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProductTile = ({ pet, onTileClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    firstpet: '',
    whyadopt: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, address, firstpet, whyadopt } = formData;
    const petid = pet._id; // assuming pet has an id property  
    try {
      const response = await axios.post(
        `${BACKEND_URL}/happytails/apply/submitForm`, 
        { name, email, address, firstpet, whyadopt, petid },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Include cookies with the request
        }
      );
  
      const result = response.data;
  
      if (result.success) {
        toast.success("applied successfully");
        setIsModalOpen(false); // Close modal after successful submission
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <motion.div
        className="w-1vw max-w-sm mx-auto bg-[#f0f4f8] pb-2 rounded-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <div>
          <div className="relative">
            <motion.img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-[300px] object-cover rounded-t-lg cursor-pointer"
              onClick={() => onTileClick(pet)}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 mt-4 pl-3 text-[#013756]">
              {pet.name}
            </h2>
          </div>
          <div className="flex justify-between items-center mx-3 mb-2">
            <motion.button
              className="px-3 py-1 bg-green-500 rounded-md flex items-center gap-4 justify-between"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
            >
              <CalendarArrowUp className="text-white" />
              <div className="text-zinc-100">Apply</div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal for applying */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-bold mb-4">Apply for {pet.name}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Your Address"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <input
                type="text"
                name="firstpet"
                value={formData.firstpet}
                onChange={handleInputChange}
                placeholder="Is this your first pet?"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <textarea
                name="whyadopt"
                value={formData.whyadopt}
                onChange={handleInputChange}
                placeholder="Why do you want to adopt?"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTile;