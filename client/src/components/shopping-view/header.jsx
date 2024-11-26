import React, { useEffect, useState } from "react";
import { LogOut, Menu, UserCog, PawPrint, Settings,} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { logoutUser } from "../../store/auth-slice";
import axios from "axios";
import { PetViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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

function HeaderRightContent({ user, setUser }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/auth/logout`, {
        withCredentials: true,
      });
      dispatch(logoutUser());
      setUser(null);
      
      // Clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  // If user is not defined, return null or a placeholder
  if (!user) return null;

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {user.admin && ( // Remove optional chaining
        <Button
          onClick={() => navigate("/admin/pets")}
          variant="outline"
          className="text-[#1a79af] border-[#1a79af]"
        >
          <Settings className="mr-2 h-4 w-4" />
          Admin Dashboard
        </Button>
      )}

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
          <DropdownMenuLabel>Logged in as {user.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/pet/account")}>
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
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
      
    axios.get(`${BACKEND_URL}/getUser`, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError("Failed to fetch user data");
        console.error(err);
      });
  }, []);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-[#F7F7F7]">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/pet/home" className="flex items-center gap-2">
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
            <HeaderRightContent user={user} setUser={setUser} />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent user={user} setUser={setUser} />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
