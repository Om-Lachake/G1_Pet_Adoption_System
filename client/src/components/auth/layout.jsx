import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  const [rotation, setRotation] = useState([360, 400]); // Initial rotation for each "eye"

  useEffect(() => {
    const handleMouseMove = (event) => {
      const eyes = document.querySelectorAll(".eye"); // Use a class selector for each eye
      if (!eyes) return;

      eyes.forEach((eye, index) => {
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + eye.clientWidth / 2;
        const eyeCenterY = rect.top + eye.clientHeight / 2;

        const radian = Math.atan2(event.pageX - eyeCenterX, event.pageY - eyeCenterY);
        const newRotation = (radian * (180 / Math.PI) * -1) + 270 ;

        // Update rotation for each eye
        setRotation((prevRotation) => {
          const updatedRotation = [...prevRotation];
          updatedRotation[index] = newRotation;
          return updatedRotation;
        });
      });
    };

    // Add mousemove event listener when the component is mounted
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="flex h-screen w-[100%]">
      <div className="hidden lg:flex h-screen items-center justify-center bg-gradient-to-r from-[#23E4FF] to-blue-600 w-1/2">
        <div className="max-w-md space-y-6 text-center text-primary-foreground flex flex-col justify-between items-center gap-10">
          <div className="Eyes w-full overflow-hidden">
            <div className="w-full h-full">
              <div className="text-white flex items-center justify-center  gap-[3vw]">
                {/* Left Eye */}
                <div className="eye w-[10vw] h-[10vw] flex items-center justify-center rounded-full bg-zinc-100">
                  <div className="w-2/3 h-2/3 relative rounded-full bg-zinc-900">
                    <div
                      style={{
                        transform: `translate(-50%, -50%) rotate(${rotation[0]}deg)`,
                        transition: "transform ease-in",
                      }}
                      className="line absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] w-full h-6"
                    >
                      <div className="w-6 h-6 rounded-full bg-zinc-200"></div>
                    </div>
                  </div>
                </div>

                {/* Right Eye */}
                <div className="eye w-[10vw] h-[10vw] flex items-center justify-center rounded-full bg-zinc-100">
                  <div className="w-2/3 h-2/3 relative rounded-full bg-zinc-900">
                    <div
                      style={{
                        transform: `translate(-50%, -50%) rotate(${rotation[0]}deg)`,
                        transition: "transform ease-in", // Smooth transition
                      }}
                      className="line absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] w-full h-6"
                    >
                      <div className="w-6 h-6 rounded-full bg-zinc-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-white text-2xl">Our pets are eagerly looking for you! Come find the furry friend who needs your love.</div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
