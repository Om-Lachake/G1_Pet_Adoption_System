  import React, { useEffect, useState } from "react";
  import { motion } from "framer-motion";
  import { CalendarArrowUp, CalendarCheck2 ,CalendarX2 } from "lucide-react";
  import axios from "axios";
  import {useNavigate} from "react-router-dom";
  import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
  import { toast } from "react-toastify";
  import { useDispatch } from "react-redux";
  import {PawPrint} from "lucide-react";
  import {logoutUser } from "../../store/auth-slice";
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const ShoppingAccount = () => {
    const [applications, setApplications] = useState([]);
    const [user, setUser] = useState(null);
    const [pets, setPets] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
      // Dispatch the logout action to reset the Redux state
      await axios.get(`${BACKEND_URL}/auth/logout`, {
        withCredentials: true,
      });
      dispatch(logoutUser());
      setUser(null);
      // Clear the cookie
      const clearAllCookies = () => {
        document.cookie.split(";").forEach((cookie) => {
          const name = cookie.split("=")[0].trim();
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
      };

      // Usage
      clearAllCookies();
      toast.success("Logged out successfully!");
      navigate("/login");
    };

    useEffect(() => {
      
      axios.get(`${BACKEND_URL}/getUser`, { withCredentials: true })
        .then((response) => {
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            setError(response.data.message);
          }
        })
        .catch((err) => {
          setError("Failed to fetch user data");
          console.error(err);
        });
    }, []);

    useEffect(() => {
      const fetchPetsAndApplications = async () => {
        setIsLoading(true);
        try {
          // Fetch all pets
          const petsResponse = await axios.get(
            `${BACKEND_URL}/happytails/api/pets`,
            { withCredentials: true }
          );
          
          // Fetch all applications for the current user
          const applicationsResponse = await axios.get(
            `${BACKEND_URL}/happytails/apply/getForm?email=${user?.email}`,
            { withCredentials: true }
          );
          
          const petsData = petsResponse.data.pets;
          const applicationsData = applicationsResponse.data.forms;
          
          // Filter out pets that are associated with the current user's email
          const filteredPets = petsData.filter(
            (pet) => applicationsData.some((application) => application.petid === pet._id && application.email === user?.email)
          );
          setPets(filteredPets);
          setApplications(applicationsData);
        } catch (error) {
          setError("Error fetching pets or applications");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
    
      if (user) {
        fetchPetsAndApplications();
      }
    }, [user]);
    

    if (error) {
      console.error("error");
    }

    if (!user) {
      return <div className="h-screen flex items-center justify-center">
      <ClimbingBoxLoader color={"#2563eb"} loading={isLoading} size={30} />
    </div>;
    }

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
            {user.username}'s Account
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
            <PawPrint 
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 bg-[#1a79af] text-white "
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
                {user.username}
              </motion.h2>
              <motion.p
                className="text-lg text-gray-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {user.email}
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
                transition={{ duration: 0.5, delay: 1.2 }}
                onClick={handleLogout}
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
          {applications.map((application) => {
            // Find the pet associated with the current application
            const pet = pets.find((pet) => pet._id === application.petid);

            // If no pet is found, skip rendering for this application
            if (!pet) return null;

            return (
              <motion.div
                key={application._id}
                className="w-full bg-[#f0f4f8] p-4 rounded-lg shadow-md flex flex-col justify-between"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                style={{ height: "350px" }} // Fixed height for the card
              >
                <motion.img
                  src={pet.imageUrl} // Use pet's imageUrl
                  alt="Application Pet"
                  className="w-full max-h-[20vh] object-cover object-center rounded-t-lg"
                />
                <div className="mt-4 flex flex-col justify-between h-full">
                  <h4 className="text-xl font-semibold text-[#013756]">{pet.name}</h4>
                  <p className="text-sm text-gray-500 mt-2 h-10">{pet.description}</p>
                  <motion.button
                    className={`mt-4 px-4 py-2 ${application.status == "approved" ? "bg-green-500" : (application.status == "pending" ? "bg-yellow-500" : "bg-red-500") } text-white rounded-md flex items-center justify-center`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay:0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {application.status == "approved" ? <CalendarCheck2 className="mr-2" /> : (application.status == "pending" ? <CalendarArrowUp className="mr-2" /> :  <CalendarX2 className="mr-2" />) }
                    
                    {application.status}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
        </motion.div>
      </div>
    );
  };

  export default ShoppingAccount;
