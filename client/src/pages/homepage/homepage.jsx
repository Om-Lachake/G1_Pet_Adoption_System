import React from 'react';
import Navbar from '../../components/navbar';
import CategoryCard from '../../components/category-card';
import ShoppingHeader from '../shopping-view/header';


function Homepage() {
  const categories = [
    { title: 'Dogs', icon: '🐕', path: '/dogs' },
    { title: 'Cats', icon: '🐱', path: '/cats' },
    { title: 'Other Animals', icon: '🐾', path: '/other' },
    { title: 'Shelters & Rescues', icon: '🏠', path: '/shelters' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        <ShoppingHeader/>
      <Navbar />
      <main className="relative">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-purple-600 opacity-90 h-[500px]" /> */}


        <div
        className="absolute inset-0 bg-cover bg-center opacity-90 h-[500px]"
        style={{
            backgroundImage: "url('https://www.shutterstock.com/image-photo/heartwarming-moment-between-dog-cat-600nw-2432338827.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        ></div>
        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center text-black mb-16">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              Find your new best friend
            </h1>
            <p className="mt-4 text-xl">
              Browse pets from our network and find yours!
            </p>
          </div>

        
        

          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.title}
                title={category.title}
                icon={category.icon}
                path={category.path}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Homepage;