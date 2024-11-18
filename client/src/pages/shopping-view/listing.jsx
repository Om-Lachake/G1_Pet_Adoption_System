import React, { useEffect, useState } from "react";
import ProductFilter from "../../components/shopping-view/filter";
import ProductTile from "../../components/shopping-view/Product-tile";
import Input from "../../components/custom-ui/Input";
import { PencilLine } from "lucide-react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ShoppingListing = () => {
  const [filters, setFilters] = useState({});
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

    const fetchPetsAndForms = async () => {
    setIsLoading(true);
    try {
      // Fetch all pets
      const petsResponse = await axios.get(
        `${BACKEND_URL}/happytails/api/pets`,
        { params: filters, withCredentials: true }
      );

      // Fetch all forms
      const formsResponse = await axios.get(
        `${BACKEND_URL}/happytails/apply/getForm`,
        { withCredentials: true }
      );

      const pets = petsResponse.data.pets;
      const forms = formsResponse.data.forms;

      // Filter out pets associated with approved forms
      const filteredPets = pets.filter(
        (pet) => !forms.some((form) => form.petid === pet._id && form.status === "approved")
      );

      setPets(filteredPets);
    } catch (error) {
      console.error("Error fetching pets or forms:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPetsAndForms();
  }, [filters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      {/* Filter should take one column */}
      <div className="lg:col-span-1">
        <ProductFilter filters={filters} setFilters={setFilters} />
        <div className="mt-2 p-4 flex flex-col gap-5">
          <div className=" text-[#001f3f] text-xl font-semibold">
            Description
          </div>
          <Input
            icon={PencilLine}
            iconKeep="true"
            iconColor="text-zinc-900"
            textColor="text-black"
            bgColor="bg-zinc-100"
            borderColor="border-zinc-700"
            placeHolderColor="placeholder-zinc-300"
            placeholder="Description"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
      </div>
      {/* "All Pets" should span the remaining columns */}
      <div className="bg-background w-full rounded-lg shadow-sm lg:col-span-3">
        <div className="p-4 border-b flex  text-[#001f3f] items-center justify-between">
          <h2 className="text-2xl">All Pets</h2>
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">{pets.length} Pets</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {pets.map((pet) => (
            <ProductTile key={pet._id} pet={pet} onTileClick={setSelectedPet}/>
          ))}
        </div>
      </div>
      {selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Hey I am {selectedPet.name} !</h2>
            <img
              src={selectedPet.imageUrl || "default_image.jpg"}
              alt={selectedPet.name}
              className="w-full h-[200px] object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-600">Name: {selectedPet.name}</p>
            <p className="text-sm text-gray-600">Description: {selectedPet.description}</p>
            <p className="text-sm text-gray-600">Age: {selectedPet.age}</p>
            <p className="text-sm text-gray-600">Gender: {selectedPet.gender}</p>
            <button
              onClick={() => setSelectedPet(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListing;
