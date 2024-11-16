import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <a href="/" className="flex items-center px-20 py-2 text-sm font-medium">
              ADOPT OR GET INVOLVED
            </a>
            <a href="/dogs" className="flex items-center px-16 py-2 text-sm font-medium">
              DOGS & PUPPIES
            </a>
            <a href="/cats" className="flex items-center px-16 py-2 text-sm font-medium">
              CATS & KITTENS
            </a>
            <a href="/other" className="flex items-center px-20 py-2 text-sm font-medium">
              OTHER TYPES OF PETS
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;