import React from 'react'
import ShoppingHeader from './header';
import { Outlet } from 'react-router-dom';

const ShoppingLayout = () => {
    return (
        <div className="flex flex-col bg-[#F7F7F7] overflow-hidden ">
          {/* common header */}
          <ShoppingHeader />
          <main className="flex flex-col w-full">
            <Outlet />
          </main>
          
        </div>
      );
}

export default ShoppingLayout
