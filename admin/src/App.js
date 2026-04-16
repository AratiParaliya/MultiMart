import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import './responsive.css';

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Product/Products";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";

import Sidebar from "./components/sidebar";
import { createContext, useEffect, useState } from "react";
import ProductDetails from "./pages/Product/ProductDetails";
import ProductUpload from "./pages/Product/ProductUpload";
import CategoryUpload from "./pages/Category/CategoryUpload";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CategoryList from "./pages/Category/categoryList";
import LoadingBar from "react-top-loading-bar";
import AddSubCategory from "./pages/Category/addSubCategory";
import SubCategoryList from "./pages/Category/subcategoryList";
import ProtectedRoute from "../src/components/protextedRoute";
import { SearchProvider } from "./context/SearchContext";
 import Receipt from "./pages/Receipt";
import { useLocation } from "react-router-dom";
import AdminAuthHandler from "./AdminAuthHandler";
import Users from "./pages/Users";
import { editData, fetchDataFromApi, postData } from "./utils/api";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import Payments from "./pages/Payment";
import BannerUpload from "./pages/bannerupload";
import BannerList from "./pages/banner-list";
import MyAccount from "./pages/MyAccount";
import OrderDetails from "./pages/OrderDetails";
import UpdateOrder from "./components/UpdateOrder";

const MyContext = createContext();

function App() {

  const [open, setOpen] = useState(false)

  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [themeMode, setThemeMode] = useState(true);
  const [progress, setProgress] = useState(0);
const [isLogin, setisLogin] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [authChecked, setAuthChecked] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
  const [alertBox, setAlertBox] = useState({
    msg: '',
    error:false,
    open:false
  })
  
useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const token = params.get("token");
  const user = params.get("user");

  if (token && user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", decodeURIComponent(user));

    setisLogin(true);

    window.history.replaceState({}, document.title, "/admin/dashboard");
  }

  // ✅ VERY IMPORTANT
  setAuthChecked(true);
}, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertBox({
      open: false,
  })
  }
  useEffect(() => {
    if (themeMode===true) {
       document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('themeMode','light')
    } else {
      document.body.classList.remove('light');
       document.body.classList.add('dark');
    localStorage.setItem('themeMode','dark')
    }
   
   
  },[themeMode]);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  
const addToCart = async (product, variant, variantType, qty = 1) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    setAlertBox({
      open: true,
      error: true,
      msg: "Please login first!"
    });
    return;
  }

  const data = {
    userId: user._id,
    productId: product._id,
    quantity: qty,
    variant,
    variantType
  };



  const res = await postData("/api/cart/add", data);

  if (!res.error) {
    setAlertBox({
      open: true,
      error: false,
      msg: "Product added to cart!"
    });
  }
};

   const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    themeMode,
     setThemeMode,
     windowWidth,
     setWindowWidth,
     open,
     setOpen,
     alertBox,
     setAlertBox,
     progress,
     setProgress,
     isLogin,
       addToCart,
     setisLogin,
     searchQuery,
     setSearchQuery
     
  
   }


  return (


    <BrowserRouter>
       <SearchProvider>
      <MyContext.Provider value={values}>
<AdminAuthHandler/>
        <LoadingBar
          color='#1866ee'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className='topLoadingBar'
           />
     <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>

          <Alert 
            onClose={handleClose}
            severity={alertBox.error===false?"success":"error"}
            variant="filled"
            sx={{ width: '100%' }}>
            {alertBox.msg}
          </Alert>
     </Snackbar>
      <Header />
      <div className="main d-flex">
          <div className={`sidebarWrapper  ${isToggleSidebar === true ? "toggle" : ""}`}>
          <Sidebar/>
        </div>
          <div className={`content  ${isToggleSidebar === true ? "toggle" : ""}`}>
            

            {authChecked && (
           <Routes>
     

<Route path="/receipts" element={<Receipt />} />
          <Route path="/" exact={true} element={<Dashboard/>} />
          <Route path="/dashboard" exact={true} element={<Dashboard/>} />
     
              <Route path="/products" exact={true} element={<Products />} />
                 <Route path="/users" exact={true} element={<Users/>} />
              <Route path="/product/details" exact={true} element={<ProductDetails />} />
              <Route path="/product/details/:id" element={<ProductDetails />} />
              <Route path="/product/upload" exact={true} element={<ProductUpload />} />
                 <Route path="/product/upload/:id" exact={true} element={<ProductUpload/>} />
              <Route path="/category/add" exact={true} element={<CategoryUpload />} />
              <Route path="/category/add/:id" exact={true} element={<CategoryUpload/>} />
              <Route path="/categoryList" exact={true} element={<CategoryList />} />
              <Route path="/subcategoryList" exact={true} element={<SubCategoryList />} />
              <Route path="/subcategory/add" exact={true} element={<AddSubCategory />} />
              <Route path="/subcategory/add/:id" exact={true} element={<AddSubCategory />} />
              <Route path="/orders" exact={true} element={<Orders />} />
              <Route path="/Review" exact={true} element={<Reviews />} />
              <Route path="/Payments" exact={true} element={<Payments />} />
              <Route path="/banner" exact={true} element={<BannerUpload />} />
                 <Route path="/banner/:id" exact={true} element={<BannerUpload />} />
              <Route path="/banner-list" exact={true} element={<BannerList />} />
               <Route path="/myAccount/:id" exact={true} element={<MyAccount/>} />
            <Route path="/admin/dashboard"element={  <ProtectedRoute adminOnly={true}>  <Dashboard /></ProtectedRoute> }     />
                <Route path="/order/:id" element={<OrderDetails />} />
                <Route path="/update-order/:id" element={<UpdateOrder />} />
              </Routes>
               )}
     
</div>

          </div>
       
        </MyContext.Provider>+
        </SearchProvider>
    </BrowserRouter>
  
  );
}

export default App;
export {MyContext}
