import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {Eye} from "lucide-react"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminOrders = () => {
  const [pendingForms, setPendingForms] = useState([]);
  const [approvedForms, setApprovedForms] = useState([]);
  const [rejectedForms, setRejectedForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");

  // Fetch forms by status
  const fetchFormsByStatus = async (status, setForms) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/happytails/apply/getForm?status=${status}`,
        { withCredentials: true }
      );
      setForms(response.data.forms);
    } catch (err) {
      setError(`Error fetching ${status} forms`);
    }
  };

  // Fetch pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/happytails/api/pets`,
          { withCredentials: true }
        );
        setPets(response.data.pets);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  // Fetch forms for all statuses
  useEffect(() => {
    fetchFormsByStatus("pending", setPendingForms);
    fetchFormsByStatus("approved", setApprovedForms);
    fetchFormsByStatus("rejected", setRejectedForms);
  }, []);

  const getPetById = (petid) => pets.find((pet) => pet._id === petid);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/happytails/apply/updateStatus/${id}`,
        { status: newStatus },{withCredentials:true}
      );
      // Update the relevant state
      setPendingForms((prev) => prev.filter((form) => form._id !== id));
      if (newStatus === "approved") setApprovedForms((prev) => [...prev, id]);
      if (newStatus === "rejected") setRejectedForms((prev) => [...prev, id]);
      window.location.reload();
    } catch (err) {
      toast("Error updating status");
    }
  }; 

  return (
<div className="p-4">
  <h1 className="text-2xl font-bold mb-4 text-[#013756] ">Application Forms</h1>

  {error && <p className="text-red-500">{error}</p>}

  {/* Pending Forms Section */}
  <section className="mb-8  text-[#1a79af]">
    <h2 className="text-xl font-bold mb-4 text-[#013756]">Pending Forms</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {pendingForms.map((form) => {
        const pet = getPetById(form.petid);
        const uniqueKey = `${form._id}-${form.email}`;
        return (
          <div
            key={uniqueKey}
            className="bg-white border border-gray-300  p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <p className="font-semibold ">Name: {form.name}</p>
            <p>Email: {form.email}</p>
            <div>
              <p className="font-semibold">Pet:</p>
              {pet ? (
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-[100px] object-scale-down rounded-lg"
                  onClick={() => setSelectedPet(pet)}
                />
              ) : (
                <p>No Pet Found</p>
              )}
            </div>
            <p>Status: {form.status}</p>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => updateStatus(form._id, "approved")}
              >
                Approve
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => updateStatus(form._id, "rejected")}
              >
                Reject
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setSelectedForm(form)}
              >
                Review
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </section>

  {/* Approved Forms Section */}
  <section className="mb-8  text-[#1a79af]">
    <h2 className="text-xl font-bold mb-4 text-[#013756] ">Approved Forms</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {approvedForms.map((form) => {
        const pet = getPetById(form.petid);
        return (
          <div
            key={form._id}
            className="bg-white border border-gray-300 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <p ><span className="font-semibold" >Name:</span> {form.name}</p>
            <p><span className="font-semibold" >Email:</span> {form.email}</p>
            <div>
              <p className="font-semibold">Pet:</p>
              {pet ? (
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-[100px] object-scale-down rounded-lg"
                  onClick={() => setSelectedPet(pet)}
                />
              ) : (
                <p>No Pet Found</p>
              )}
            </div>
            <p><span className="font-semibold" >Status:</span> {form.status}</p>
            <button
              className="bg-green-500 text-white px-3 py-2 rounded mt-4 flex items-center justify-between gap-2"
              onClick={() => setSelectedForm(form)}
            >
              <Eye />Review
            </button>
          </div>
        );
      })}
    </div>
  </section>

  {/* Rejected Forms Section */}
  <section className="mb-8  text-[#1a79af]">
    <h2 className="text-xl font-bold mb-4 text-[#013756]">Rejected Forms</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rejectedForms.map((form) => {
        const pet = getPetById(form.petid);
        return (
          <div
            key={form._id}
            className="bg-white border border-gray-300 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <p><span className="font-semibold" >Name:</span> {form.name}</p>
            <p><span className="font-semibold" >Email:</span> {form.email}</p>
            <div>
              <p><span className="font-semibold" >Pet:</span></p>
              {pet ? (
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-[100px] object-scale-down rounded-lg"
                  onClick={() => setSelectedPet(pet)}
                />
              ) : (
                <p>No Pet Found</p>
              )}
            </div>
            <p><span className="font-semibold" >Status:</span> {form.status}</p>
            <button
              className="bg-green-500 text-white px-3 py-2 rounded mt-4 flex items-center justify-between gap-2"
              onClick={() => setSelectedForm(form)}
            >
              <Eye />Review
            </button>
          </div>
        );
      })}
    </div>
  </section>

  {/* Review Form Modal */}
  {selectedForm && (
    <div className="fixed inset-0 text-[#013756] bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-1/2">
        <h2 className="text-xl font-bold mb-4">Review Form</h2>
        <p>
          <strong>Name:</strong> {selectedForm.name}
        </p>
        <p>
          <strong>Email:</strong> {selectedForm.email}
        </p>
        <p>
          <strong>Address:</strong> {selectedForm.address}
        </p>
        <p>
          <strong>First Pet:</strong> {selectedForm.firstpet ? "Yes" : "No"}
        </p>
        <p>
          <strong>Reason for Adoption:</strong> {selectedForm.whyadopt}
        </p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => setSelectedForm(null)}
        >
          Close
        </button>
      </div>
    </div>
  )}

  {/* Pet Details Model */}
  {selectedPet && (
    <div className="fixed inset-0 bg-black text-[#013756] bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-1/2">
        <h2 className="text-xl font-bold mb-4">Pet Details</h2>
        <img
          src={selectedPet.imageUrl}
          alt={selectedPet.name}
          className="w-full h-[300px] object-scale-down rounded-lg mb-4"
        />
        <p>
          <strong>Name:</strong> {selectedPet.name}
        </p>
        <p>
          <strong>Age:</strong> {selectedPet.age}
        </p>
        <p>
          <strong>Description:</strong> {selectedPet.description}
        </p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => setSelectedPet(null)}
        >
          Close
        </button>
      </div>
    </div>
  )}
</div>


  );
};

export default AdminOrders;
