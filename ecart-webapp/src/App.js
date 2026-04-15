import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./style.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Components/Footer";
import ProductModal from "./Components/ProductModal";
import Listing from "./Pages/Listing";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import ProtectedRoute from "./Components/ProtectedRoute";
import UserProfile from "./Pages/UserProfile";
import { postData } from "./utils/api";
import Wishlist from "./Pages/Wishlist";
import CheckOut from "./Pages/checkOutPage/checkOutPage";
import MyOrders from "./Pages/MyOrders";
import OrderDetails from "./Pages/OrdereDetail";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifiedSuccess from "./Components/VerifiedSuccess";
import VerifyStatus from "./Components/VerifiedSuccess";


const MyContext = createContext();

function App() {
  const [isOpenProductModel, setisOpenProductModel] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [isLogin, setisLogin] = useState(false);
const [search, setSearch] = useState("");


const [productId, setProductId] = useState(null);
const [cartItems, setCartItems] = useState(
  JSON.parse(localStorage.getItem("cart")) || []
);
  
  const [alertBox, setAlertBox] = useState({
  open: false,
  msg: "",
  error: false
  });
  


  


  const values = {
    countryList,
    setCountryList,
    setselectedCountry,
    selectedCountry,
    isOpenProductModel,
    setisOpenProductModel,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    isLogin,
    setisLogin,
 
  productId,
    setProductId,
  
    cartItems,
   setCartItems,

    alertBox,
    setAlertBox,
    search,
    setSearch,
  
  };

  useEffect(() => {
  if (alertBox.open) {
    const timer = setTimeout(() => {
      setAlertBox({
        open: false,
        msg: "",
        error: false
      });
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [alertBox]);

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
  }, []);

useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    setisLogin(true);
  } else {
    setisLogin(false);
  }
}, []);

  const getCountry = async (url) => {
    const response = await axios.get(url);
    setCountryList(response.data.data);
  
  };

  

  return (
    <BrowserRouter>
      <MyContext.Provider value={ values}>

        {
          isHeaderFooterShow === true &&   <Header />
        }
      

        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/cat" exact={true} element={<Listing />} />
          <Route path="/product/:id" exact={true} element={<ProductDetails />} />
          <Route path="/cart/:id" exact={true} element={<Cart/>} />
          <Route path="/SignIn" exact={true} element={<SignIn />} />
          <Route path="/SignUp" exact={true} element={<SignUp />} />
          <Route path="/cat/:id" element={<Listing />} />
          <Route path="/subcat/:id" element={<Listing />} />
          <Route path="/Wishlist/:id" element={<Wishlist />} />
            <Route path="/checkOut/:id" element={<CheckOut/>} />
          <Route path="/myOrders/:id" element={<MyOrders />} />
              <Route path="/orderdetails/:id" element={<OrderDetails/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-status" element={<VerifyStatus />} />
<Route path="/cat/trending/:country" element={<Listing />} />
       <Route path="/profile/:id"  element={    <ProtectedRoute> <UserProfile />  </ProtectedRoute> }

/>
        </Routes>
         {
  alertBox.open && (
    <div
      className={`alert ${alertBox.error ? "alert-danger" : "alert-success"}`}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 9999,
        minWidth: "250px"
      }}
    >
      {alertBox.msg}
    </div>
  )
}

         {
          isHeaderFooterShow === true && <Footer />
        }
          {
        isOpenProductModel === true && <ProductModal   />
        }
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
