import React from "react";
import { motion } from "framer-motion";
import { CalendarArrowUp, CalendarCheck2 ,CalendarX2 } from "lucide-react";

const ShoppingAccount = () => {
  const applications = [
    { id: 1, name: "Pet Adoption", description: "Adopt a furry friend today!",petImg:"https://i.pinimg.com/736x/b1/a3/8f/b1a38fca0356c80ba805f095d7fee110.jpg" ,status:"Accepted"},
    { id: 2, name: "Animal Shelter Volunteer", description: "Help out at the local shelter.",petImg:"https://i.pinimg.com/736x/b1/a3/8f/b1a38fca0356c80ba805f095d7fee110.jpg",status:"Rejected" },
    { id: 3, name: "Pet Training", description: "Become a pet trainer and help owners!",petImg:"https://i.pinimg.com/736x/b1/a3/8f/b1a38fca0356c80ba805f095d7fee110.jpg" ,status:"Pending"},
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full bg-[#013756] text-white text-center py-5 mb-10">
        <motion.h1
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Account
        </motion.h1>
      </div>

      {/* User Info Section */}
      <motion.div
        className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-6">
          {/* User Avatar */}
          <motion.img
            src="https://i.pravatar.cc/300"
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <div>
            {/* User Info */}
            <motion.h2
              className="text-2xl font-semibold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              John Doe
            </motion.h2>
            <motion.p
              className="text-lg text-gray-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              johndoe@example.com
            </motion.p>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="mt-10">
          <motion.h3
            className="text-xl font-semibold text-[#013756]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Account Settings
          </motion.h3>
          <div className="mt-6 flex flex-col gap-4">
            <motion.button
              className="py-2 px-4 text-left bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Change Password
            </motion.button>
            
            <motion.button
              className="py-2 px-4 text-left bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              Log Out
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Your Applications Section */}
      <motion.div
        className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6 mt-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h3
          className="text-xl font-semibold text-[#013756]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your Applications
        </motion.h3>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <motion.div
              key={application.id}
              className="w-full bg-[#f0f4f8] p-4 rounded-lg shadow-md flex flex-col justify-between"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              style={{ height: "350px" }} // Fixed height for the card
            >
              <motion.img
                src={application.petImg}
                alt="Application"
                className="w-full h-[200px] object-cover rounded-t-lg"
              />
              <div className="mt-4 flex flex-col justify-between h-full">
                <h4 className="text-xl font-semibold text-[#013756]">{application.name}</h4>
                <p className="text-sm text-gray-500 mt-2 h-10">{application.description}</p>
                <motion.button
                  className={`mt-4 px-4 py-2 ${application.status == "Accepted" ? "bg-green-500" : (application.status == "Pending" ? "bg-yellow-500" : "bg-red-500") } text-white rounded-md flex items-center justify-center`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay:0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {application.status == "Accepted" ? <CalendarCheck2 className="mr-2" /> : (application.status == "Pending" ? <CalendarArrowUp className="mr-2" /> :  <CalendarX2 className="mr-2" />) }
                  
                  {application.status}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ShoppingAccount;
