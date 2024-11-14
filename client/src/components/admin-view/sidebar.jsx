import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileUser,
  ChartNoAxesCombined,
  LayoutDashboard,
  PawPrint,
  X, // Add the X icon from lucide-react for the close button
} from "lucide-react";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "Pets",
    label: "Pets",
    path: "/admin/pets",
    icon: <PawPrint />,
  },
  {
    id: "Applications",
    label: "Applications",
    path: "/admin/applications",
    icon: <FileUser />,
  },
];

// Custom Sheet component
const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "flex" : "hidden"}`}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );
};

// Custom SheetContent component
const SheetContent = ({ side, className, children }) => {
  return (
    <div
      className={`bg-white shadow-lg h-full ${className} `}
      style={{
        width: "30vw",
        transform: side === "left" ? "translateX(0)" : "translateX(100%)",
      }}
      onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
    >
      {children}
    </div>
  );
};

// Custom SheetHeader component
const SheetHeader = ({ className, children }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// Custom SheetTitle component
const SheetTitle = ({ children, className }) => {
  return <div className={`flex items-center ${className}`}>{children}</div>;
};

// MenuItems component
function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            if (setOpen) setOpen(false);
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-gray-400 hover:bg-gray-300 hover:text-gray-900"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

// AdminSideBar component
function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b relative">
              <SheetTitle className="flex gap-2 mt-6 mb-6">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
              {/* Close Button in the Top Right */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 border-2 border-zinc-700 p-1 rounded-md "
              >
                <X size={18} className="text-zinc-700 hover:text-foreground"  />
              </button>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
