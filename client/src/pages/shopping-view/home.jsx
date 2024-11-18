import React from "react";
import { motion } from "framer-motion";
import ImageSlider from "./ImageSlider";


const ShoppingHome = () => {
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold text-[#013756] mb-4">Welcome to Pet Paradise</h1>
        <p className="text-lg text-gray-600">
          Discover your next best friend from our wide range of lovable pets.
        </p>
      </div>
 <ImageSlider/>
      {/* Footer Section */}
      <div className="text-center my-10">
        <p className="text-3xl text-gray-700">
          Adopt, love, and cherish a pet today. A little love goes a long way.
        </p>
      </div>
    </div>
  );
};

export default ShoppingHome;
