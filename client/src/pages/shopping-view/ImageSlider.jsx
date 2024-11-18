import { useState } from "react";
import { motion } from "framer-motion";
import img1 from "../../images/HomePage1.jpg";
import img2 from "../../images/HomePage2.jpg";
import img3 from "../../images/HomePage3.jpg";
const ImageSlider = () => {
  const [positionIndexes, setPositionIndexes] = useState([0, 1, 2 ]);

  const handleNext = () => {
    setPositionIndexes((prevIndexes) => {
      const updatedIndexes = prevIndexes.map(
        (prevIndex) => (prevIndex + 1) % 3 // Increment by 1 to move to the next image
      );
      return updatedIndexes;
    });
  };

  const handleBack = () => {
    setPositionIndexes((prevIndexes) => {
      const updatedIndexes = prevIndexes.map(
        (prevIndex) => (prevIndex + 2) % 3
      );

      return updatedIndexes;
    });
  };

  const images = [img1, img2, img3];

  const positions = ["center", "left", "right" ];

  const imageVariants = {
    center: { x: "0%", scale: 1, zIndex: 3 },
    left: { x: "-90%", scale: 0.65, zIndex: 2 },
    right: { x: "90%", scale: 0.65, zIndex: 1 }
  };
  return (
    <div className="flex items-center flex-col justify-center  h-screen">
      {images.map((image, index) => (
        <motion.img
          key={index}
          src={image}
          alt={image}
          className="rounded-[12px]"
          initial="center"
          animate={positions[positionIndexes[index]]}
          variants={imageVariants}
          transition={{ duration: 0.5 }}
          style={{ width: "30%", position: "absolute" }}
        />
      ))}
      <div className="flex flex-row gap-3 mt-10">
        <button
          className="text-white mt-[400px] bg-[#013756] rounded-md py-2 px-4"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className="text-white mt-[400px] bg-[#013756] rounded-md py-2 px-4"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;