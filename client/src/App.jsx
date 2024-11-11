import { Route, Routes } from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import AuthLogin from "./pages/auth/login"
import ForgotPassword from "./pages/auth/forgotPassword"
import GoogleAuthPassword from "./pages/auth/googleAuthPassword"
import NewPassword from "./pages/auth/newPassword"
import AuthRegister from "./pages/auth/register"
import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"
import ShoppingLayout from "./components/shopping-view/layout"
import NotFound from "./pages/not-found"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingListing from "./pages/shopping-view/listing"
import ShoppingCheckout from "./pages/shopping-view/checkout"
import ShoppingAccount from "./pages/shopping-view/account"
import CheckAuth from "./components/common/check-auth"
import UnAuthPage from "./pages/unauth-page"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkAuth } from "./store/auth-slice"
import VerifyOtp from "./pages/verification/verifyOtp"

function App() {

  const {user, isAuthenticated,isLoading ,isVerified,isLoggedIn} = useSelector(state => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth()); // Dispatch checkAuth to update the Redux store   checkAuth()
  }, [dispatch]);

  useEffect(() => {
  }, [isAuthenticated, isVerified, user, isLoggedIn]); // Add dependencies for state changes


  if(isLoading){
    return <div>Loading...</div>
  }
  return (//paths for pages
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route path="/" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}  >
          <AuthLayout/>
        </CheckAuth>}>
          <Route path="login" element={<AuthLogin/>} /> 
          <Route path="signup" element={<AuthRegister/>} />
          <Route path="verifyOTP" element={<VerifyOtp/>} />
          <Route path="forgotpassword" element={<ForgotPassword/>}/>
          <Route path="newpassword" element={<NewPassword/>}/>
          <Route path="googleauthpassword" element={<GoogleAuthPassword/>}/>
        </Route>
        <Route path="/admin" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}  >
          <AdminLayout/>
        </CheckAuth>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          
        </Route>
        <Route path="/shop" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}  >
          <ShoppingLayout/>
        </CheckAuth>} >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>
        <Route path="unauth-page" element={<UnAuthPage/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  )
}

export default App
