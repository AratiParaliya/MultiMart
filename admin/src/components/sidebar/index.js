import Button from "@mui/material/Button";
import { FaAngleRight, FaBell, FaCartArrowDown, FaProductHunt } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";

import { RxDashboard } from "react-icons/rx"
import { IoIosSettings, IoMdLogOut } from "react-icons/io"
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { MyContext } from "../../App";
import { MdCategory } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { TbBorderStyle2 } from "react-icons/tb";
import { MdReviews } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { GiKnightBanner } from "react-icons/gi";
const Sidebar = () => {


    const [activeTab, setActiveTab] = useState(null);
    // const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const context = useContext(MyContext);

  const isOpenSubmenu = (index) => {
  if (activeTab === index) {
    setActiveTab(null); // close
  } else {
    setActiveTab(index); // open
  }
};       





    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                       
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className="icon"> <RxDashboard /></span>
                                Dashboard
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                     
                    </li>

                    <li>

                        <Button className={`w-100 ${activeTab === 1  ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className="icon"> <FaProductHunt /></span>
                            Products
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
<div className={`submenuWrapper ${activeTab === 1 ? 'collapse' : ''}`}>
                            <ul className="submenu">
                                <li><Link to="/products">Product List</Link></li>
                            
                                <li><Link to="/product/upload">Product Upload</Link></li>

                            </ul>
                        </div>
                    </li>
 <li>

                        <Button className={`w-100 ${activeTab === 2  ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                            <span className="icon"> <BiSolidCategoryAlt /></span>
                           Category
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
<div className={`submenuWrapper ${activeTab === 2 ? 'collapse' : ''}`}>
                            <ul className="submenu">
                                <li><Link to="/categoryList"> Category List</Link></li>
                                <li><Link to="/category/add">Add Category</Link></li>

                            </ul>
                        </div>
                    </li>
                   <li>

                        <Button className={`w-100 ${activeTab === 3  ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                            <span className="icon"> <MdCategory /></span>
                           SubCategory
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
<div className={`submenuWrapper ${activeTab === 3 ? 'collapse' : ''}`}>
                            <ul className="submenu">
                             
 <li><Link to="/subcategoryList"> SubCategory List</Link></li>
                                <li><Link to="/subcategory/add">Add SubCategory</Link></li>
                            </ul>
                        </div>
                    </li>

                     <li>
                        <Link to="/users">
                            
                        <Button className={`w-100 ${activeTab === 4  ? 'active' : ''}`} >
                            <span className="icon"> <FaCircleUser /></span>
                          Users
                            <span className="arrow"><FaAngleRight /></span>
                            </Button>
                            </Link>

                    </li>
                      <li>
<Link to="/orders">
                        <Button className={`w-100 ${activeTab === 5  ? 'active' : ''}`} >
                            <span className="icon"> <TbBorderStyle2 /></span>
                          Orders 
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
</Link>
                    </li>
                         <li>
<Link to="/Review">
                        <Button className={`w-100 ${activeTab === 6  ? 'active' : ''}`} >
                            <span className="icon"> <MdReviews /></span>
                          Reviews
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
</Link>
                    </li>
                       <li>
<Link to="/receipts">
                        <Button className={`w-100 ${activeTab === 7  ? 'active' : ''}`} >
                            <span className="icon"> <MdReviews /></span>
                          Receipts
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
</Link>
                    </li>
                    <li>
  <Button className={`w-100 ${activeTab === 8  ? 'active' : ''}`} onClick={() => isOpenSubmenu(8)}>
                            <span className="icon"> <GiKnightBanner /></span>
                           Banner
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
<div className={`submenuWrapper ${activeTab === 8 ? 'collapse' : ''}`}>
                            <ul className="submenu">
                             
 <li><Link to="/banner-List">Banner List</Link></li>
                                <li><Link to="/banner">Add Banner</Link></li>
                            </ul>
                        </div>
                    </li>
                        <li>
<Link to="/Payments">
                        <Button className={`w-100 ${activeTab === 9  ? 'active' : ''}`} >
                            <span className="icon"> <MdPayments /></span>
                          Payment
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
</Link>
                    </li>
                </ul>

                <br />
                <div className="logoutWrapper">
                    <div className="logoutBox">
                        <Button variant="contained" onClick={() => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  context.setisLogin(false);
   window.open("http://localhost:3000/SignIn", "_self");
}}><IoMdLogOut />Logout</Button>
                    </div>

                </div>
            </div>
        </>
    )
}
export default Sidebar;