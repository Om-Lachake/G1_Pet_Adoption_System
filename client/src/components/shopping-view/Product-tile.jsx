import React from "react";
import {CalendarArrowUp} from 'lucide-react'
import { toast } from "react-toastify";
import {motion} from "framer-motion"
const ProductTile = () => {
  return (
    <div>
      <motion.div
      className="w-1vw max-w-sm mx-auto bg-[#f0f4f8] pb-2 rounded-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      <div>
        <div className="relative">
          <motion.img
            src="https://i.pinimg.com/736x/b1/a3/8f/b1a38fca0356c80ba805f095d7fee110.jpg"
            alt="Dog name"
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 mt-4 pl-3 text-[#013756]">PetName</h2>
          <div className="flex justify-between items-center mb-4 pl-3 mt-4">
            <span className="text-sm font-semibold text-primary text-[#013756] ">
            Description
            </span>
          </div>
        </div>
        <div className="flex  justify-between items-center mx-3 mb-2">
          <motion.button
            className="px-3 py-1 bg-green-500 rounded-md flex items-center gap-4 justify-between"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(pet)}
          >
            <CalendarArrowUp className="text-white" />
            <div className="text-zinc-100" > Apply </div>
            
          </motion.button>
          
        </div>
      </div>
    </motion.div>

    </div> 
  )
}

export default ProductTile