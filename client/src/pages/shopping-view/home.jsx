import React from "react";
import { motion } from "framer-motion";
import ImageSlider from "./ImageSlider";

const ShoppingHome = () => {
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center bg-auto bg-center bg-fixed bg-[url('/images/Userbg.jpg')] ">
      {/* Header Section */}
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold text-black mb-4">Welcome to HappyTails</h1>
        <p className="text-3xl font-bold text-black p-4 rounded">
          Discover your next best friend from our wide range of lovable pets.
        </p>
      </div>

      <ImageSlider />

      {/* Footer Section */}
      <div className="text-center my-10">
        <p className="text-3xl font-bold text-black p-4 rounded">
          Adopt, love, and cherish a pet today. A little love goes a long way.
        </p>
        <small className="text-sm font-bold text-black block mb-4">
          Contact us at happytailsg1@gmail.com
        </small>
        <a
          href="https://github.com/Om-Lachake/G1_Pet_Adoption_System"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-black font-bold underline hover:text-[#02589b]"
        >
          Review our work on GitHub
        </a>
      </div>
    </div>
  );
};

export default ShoppingHome;