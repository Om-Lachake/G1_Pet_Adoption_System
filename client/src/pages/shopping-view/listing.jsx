import ProductFilter from "../../components/shopping-view/filter";
import ProductTile from "../../components/shopping-view/Product-tile";
import React from "react";
import Input from "../../components/custom-ui/Input";
import { PencilLine } from "lucide-react";
const ShoppingListing = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      {/* Filter should take one column */}
      <div className="lg:col-span-1">
        <ProductFilter />
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
          />
        </div>
      </div>
      {/* "All Pets" should span the remaining columns */}
      <div className="bg-background w-full rounded-lg shadow-sm lg:col-span-3">
        <div className="p-4 border-b flex  text-[#001f3f] items-center justify-between">
          <h2 className="text-2xl">All Pets</h2>
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">10 Pets</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          <ProductTile />
        </div>
      </div>
    </div>
  );
};

export default ShoppingListing;
