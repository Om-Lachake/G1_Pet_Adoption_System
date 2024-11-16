import React from 'react';

const CategoryCard = ({ title, icon, path }) => {
  return (
    <a
      href={path}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="text-center">
        <span className="text-4xl mb-4 block">{icon}</span>
        <h3 className="text-xl font-medium text-gray-900">{title}</h3>
      </div>
    </a>
  );
};

export default CategoryCard;