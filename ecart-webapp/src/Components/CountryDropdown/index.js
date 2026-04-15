import React, { useState, useContext, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import { IoIosSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { MyContext } from "../../App";   // adjust path if needed
import { resumeToPipeableStream } from "react-dom/server";
import { FaAngleDown } from "react-icons/fa6";
import "../../App.css";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropdown = () => {

  const [isOpenModel, setisOpenModel] = useState(false);
  const [selectedTab, setselectedTab] = useState(null);

  const [searchText, setSearchText] = useState("");
  const context = useContext(MyContext);
const filteredCountries = context.countryList?.filter((item) =>
  item.country.toLowerCase().includes(searchText.toLowerCase())
);

  useEffect(() => {
  const delay = setTimeout(() => {
    // filtering happens automatically
  }, 300);

  return () => clearTimeout(delay);
}, [searchText]);
  
  
useEffect(() => {
  setselectedTab(null);
}, [isOpenModel]);



  const selectCountry = (index,country) => {
    setselectedTab(index);
    setisOpenModel(false);
    context.setselectedCountry(country)
  };

  useEffect(() => {
    context.setCountryList(context.countryList);
  }, [])

  



  return (
    <>
      <button className="countryDrop" onClick={() => setisOpenModel(true)}>
        <div className="info d-flex flex-column">
          <span className="label">Your Location</span>
          <span className="name">{ context.selectedCountry!==""? context.selectedCountry.length>10  ?context.selectedCountry ?.substr(0,10)+'..':context.selectedCountry : 'Select Location'}</span>
        </div>
        <span className="ml-auto"><FaAngleDown/></span>
      </button>

      <Dialog
        open={isOpenModel}
        onClose={()=>setisOpenModel(false)}
        TransitionComponent={Transition}
        className="locationModal"
      >
        <h5 className="title">Choose your Delivery Location</h5>
        <p>Enter your address and we will specify the offer for your area.</p>

        <Button className="close_" onClick={() => setisOpenModel(false)}>
          <MdClose />
        </Button>

 <div className="headerSearch w-100">
  <input
    type="text"
    placeholder="Search your area..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />

  <Button>
    <IoIosSearch />
  </Button>
</div>

     <ul className="countryList mt-3">
  {filteredCountries?.length > 0 ? (
    filteredCountries.map((item, index) => (
      <li key={index}>
        <Button
          className={selectedTab === index ? "active" : ""}
          onClick={() => selectCountry(index, item.country)}
        >
          {item.country}
        </Button>
      </li>
    ))
  ) : (
    <p className="text-center mt-3">No area found</p>
  )}
</ul>

      </Dialog>
   </>
  );
};

export default CountryDropdown;
