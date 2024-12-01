import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import img1 from "../../images/HomePage1.jpg";
import img2 from "../../images/HomePage2.jpg";
import img3 from "../../images/HomePage3.jpg";
import img4 from "../../images/HomePage4.jpg";
import img5 from "../../images/HomePage5.jpg";
import img6 from "../../images/HomePage6.jpg";

const ImageSlider = () => {
  const images = [img1, img2, img3, img4, img5, img6];

  // Initial positions for images
  const [positionIndexes, setPositionIndexes] = useState([0, 1, 2, 3, 4, 5]);

  const positions = [
    "center",
    "left",
    "right",
    "offscreenLeft",
    "offscreenRight",
    "hidden",
  ];

  const imageVariants = {
    center: { x: "0%", scale: 0.8, zIndex: 3 },
    left: { x: "-70%", scale: 0.6, zIndex: 2 },
    right: { x: "70%", scale: 0.6, zIndex: 2 },
    offscreenLeft: { x: "-125%", scale: 0.5, zIndex: 1 },
    offscreenRight: { x: "125%", scale: 0.5, zIndex: 1 },
    hidden: { x: "200%", scale: 0.4, zIndex: 0 },
  };

  const handleNext = () => {
    setPositionIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      // Move each position forward
      newIndexes.unshift(newIndexes.pop()); // Rotate array to the right
      return newIndexes;
    });
  };


  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext(); // Automatically scroll to the next image
    }, 5000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="relative flex items-center justify-center h-[70vh] w-full">
      {images.map((image, index) => (
        <motion.img
          key={index}
          src={image}
          alt={`Image ${index + 1}`}
          className="rounded-lg"
          initial="center"
          animate={positions[positionIndexes[index]]}
          variants={imageVariants}
          transition={{ duration: 0.5 }}
          style={{
            width: "50%",
            maxWidth: "600px",
            position: "absolute",
          }}
        />
      ))}
      
    </div>
  );
};

export default ImageSlider;