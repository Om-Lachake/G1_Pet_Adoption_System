import React from "react";
import {
  LogOut,
  Menu,
  UserCog,
  PawPrint,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { verifyOtpAction, setUser, logoutUser } from "../../store/auth-slice";
import axios from "axios";
import { PetViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
function MenuItems() {
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {PetViewHeaderMenuItems.map((menuItem) => (
        <Link
          className="text-md font-medium cursor-pointer text-[#1a79af]"
          key={menuItem.id}
          to={menuItem.path}
        >
          {menuItem.label}
        </Link>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    // Dispatch the logout action to reset the Redux state
    await axios.get("http://localhost:3000/auth/logout", {
      withCredentials: true,
    });
    dispatch(logoutUser());
    // Clear the cookie
    const clearAllCookies = () => {
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    };

    // Usage
    clearAllCookies();
    toast.success("Logged out successfully!");
    navigate("/login");
  };
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <span className="flex items-center justify-start bg-white lg:bg-[#F7F7F7] w-6 p-1 ">
        <span className="sr-only">User Cart</span>
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-[#1a79af]">
            <AvatarFallback className="bg-[#1a79af] text-white ">
              <PawPrint size={20} />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          className="w-56 text-[#1a79af] bg-white"
        >
          <DropdownMenuLabel>Logged in as </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const ShoppingHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-[#F7F7F7]">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <img src="/logopa.png" className="h-16 w-auto " />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden border-none">
              <Menu className="h-6 w-6 text-[#001f3f]" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-xs bg-white shadow-lg z-50"
          >
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;