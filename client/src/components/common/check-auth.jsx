import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";  // Import useSelector

function CheckAuth({ children }) {
  const { isAuthenticated, isVerified, user, isLoggedIn } = useSelector(state => state.auth);  // Get the values from Redux store
  console.log(isAuthenticated, isVerified, isLoggedIn,"in checkauth")

  const location = useLocation();
  if (location.pathname === "/forgotpassword" || location.pathname === "/verifyOTP" || location.pathname === "/newpassword") {
    return <>{children}</>;
  }
  else if(isAuthenticated && isVerified && isLoggedIn && (location.pathname === "/login" || location.pathname==="/signup")) {
    return <Navigate to = "/shop/home"/>
  }
  else if (isAuthenticated && isVerified) {
    if (location.pathname === "/verifyOTP") {
      // If the user has already verified their account, redirect to login page
      return <Navigate to="/login" />;
    }
  }
  else if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/signup" />;
    } else {
      if (!isVerified) {
        return <Navigate to="/verifyOTP" />;
      } else {
        if(!isLoggedIn) {
          return <Navigate to="/login" />;
        } else {
          if (user?.admin === true) {
            return <Navigate to="/admin/dashboard" />;
          } else {
            return <Navigate to="/shop/home" />;
          }
        }
      }
    }
  }

  else if (!isAuthenticated && !(location.pathname.includes("/login") || location.pathname.includes("/signup"))) {
    return <Navigate to="/signup" />;
  }

  else if (isAuthenticated && !isVerified && !location.pathname.includes("/verifyOTP")) {
    return <Navigate to="/verifyOTP" />;
  }

  else if (isAuthenticated && isVerified && user?.admin === true && location.pathname.includes("admin")) {
    return <Navigate to="/unauth-page" />;
  }

  else if (isAuthenticated && isVerified && user?.admin === true && location.pathname.includes("shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
