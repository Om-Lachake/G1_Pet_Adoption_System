import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Checkbox } from "../ui/checkbox";

function ProductFilter({ filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key]?.includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...(prev[key] || []), value],
    }));
  };

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-[#001f3f]">Filters</h2>
      </div>
      <div>
        {Object.keys(filterOptions).map((keyItem, i) => (
          <Fragment key={i}>
            <div className="border-b w-fit pl-5 py-4">
              <h3 className="text-xl font-medium text-[#001f3f]">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option, ind) => (
                  <div
                    key={ind}
                    className="flex font-medium items-center gap-2 text-[#001f3f]"
                  >
                    <Checkbox
                      className="rounded-md"
                      checked={filters[keyItem]?.includes(option.id) || false}
                      onCheckedChange={() =>
                        handleFilterChange(keyItem, option.id)
                      }
                    />
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
export default ProductFilter;