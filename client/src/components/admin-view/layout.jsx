import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full ">
      {/* admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="relative flex-1 flex flex-col p-4 md:p-6 bg-auto bg-center bg-fixed bg-[url('/images/myImage.jpeg')]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-zinc-100 bg-opacity-70"></div>

          {/* Content */}
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
